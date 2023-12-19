"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks } from '@/constants/nerts'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { Stream } from '@/components/Stream'
import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'

export default function Nerts() {
    "use client"
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [river, setRiver] = useState<Card[][]>([[], [], [], []])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [players, setPlayers] = useState([{}, {},])
    const [lake, setLake] = useState<Card[][]>(Array.from({ length: 4 * players.length }, () => []))
    const [gameOver, setGameOver] = useState<boolean>(false)
    const maxWasteShowing = useRef(0)

    const deck = useMemo(() => suits.flatMap(suit => {
        return ranks.map(rank => {
            return {
                suit,
                rank,
            };
        });
    }), [])

    const shuffle = (array: any[]) => array.sort((a, b) => 0.5 - Math.random())

    useEffect(() => {
        const shuffledDeck: Card[] = shuffle(deck)
        setNertStack(shuffledDeck.splice(0, 13))
        setLake(Array.from({ length: 4 * players.length }, () => []))
        setStream(shuffledDeck)
        setWaste([])
        setRiver([
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
        ])
        maxWasteShowing.current = 0
    }, [deck, players])

    const wasteCards = useCallback(() => {
        if (gameOver) return

        const streamLength = stream.length
        let topOfStream

        if (stream.length >= 3) topOfStream = stream.splice(streamLength - 3)
        else topOfStream = stream.splice(0)

        if (topOfStream.length > 0) {
            const newWaste = [...waste, ...topOfStream]
            maxWasteShowing.current = newWaste.length
            setWaste(newWaste)
        } else {
            maxWasteShowing.current = 0
            setStream(waste.reverse())
            setWaste([])
        }
    }, [gameOver, stream, waste, maxWasteShowing, setWaste, setStream])

    const playCard = (props: PlayCardProps) => {
        if (gameOver) return

        const { card, source, pileIndex, foundationIndex } = props

        const getSourceArray = (source: string) => {
            switch (source) {
                case 'nert': return nertStack
                case 'waste': return waste
                case 'river': return river[pileIndex!]
                default: throw new Error(`Invalid source: ${source}`)
            }
        }

        type HandleUpdateRiverProps = {
            destination: number;
            source: string;
            start?: never;
        } | {
            destination: number;
            source: number;
            start: number;
        }

        const handleUpdateRiver = ({
            destination,
            source,
            start
        }: HandleUpdateRiverProps) => {
            const copyOfRiver = [...river]
            if (typeof source === 'string') {
                let sourceArray = getSourceArray(source)
                if (!sourceArray) return false
                const cardToMove = sourceArray.pop()
                if (cardToMove) copyOfRiver[destination].push(cardToMove)
            } else {
                copyOfRiver[destination].push(...copyOfRiver[source].splice(start!, copyOfRiver[source].length))
            }
            setRiver(copyOfRiver)
            return true
        }

        const handleUpdateLake = ({
            destination,
        }: {
            destination: number;
        }) => {
            let sourceArray = getSourceArray(source)
            if (!sourceArray) return false
            const copyOfLake = [...lake]
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfLake[destination].push(cardToMove)
            setLake(copyOfLake)
            return true
        }

        const tryToPlaceInLake = () => {
            return lake.some((pile, i) => {
                if (pile.length === 0) return false

                const isOneMore = card.rank.position - 1 === pile[pile.length - 1].rank.position
                const isSameSuit = card.suit.name === pile[0].suit.name

                if (isOneMore && isSameSuit) {
                    return handleUpdateLake({ destination: i })
                }

                return false
            })
        }

        const tryToPlaceInRiver = (start?: number) => {

            const placeCard = (index: number) => {
                let updateObject: HandleUpdateRiverProps

                updateObject = typeof pileIndex === 'number' && typeof start === 'number' ? { destination: index, source: pileIndex, start } : { destination: index, source }
                return handleUpdateRiver(updateObject)
            }

            const tryToPlaceOnPile = () => {
                return river.some((pile, i) => {
                    if (i === pileIndex || pile.length === 0) return false

                    const isOneLess = card.rank.position + 1 === pile[pile.length - 1].rank.position
                    const isOppositeSuit = card.suit.type !== pile[pile.length - 1].suit.type

                    if (isOneLess && isOppositeSuit) return placeCard(i)
                    else return false
                })
            }

            const tryToPlaceOnBlank = () => {
                return river.some((pile, i) => {
                    if (i === pileIndex || pile.length !== 0) return

                    return placeCard(i)
                })
            }

            return tryToPlaceOnPile() || tryToPlaceOnBlank()

        }

        let cardHandled = false

        /* handle NERTS */
        if (source === 'nert' && nertStack.length === 0) {
            // GAME OVER
            setGameOver(true)
            window.alert("GAME OVER")
            // cardHandled = true
            return true
        }

        /* handle aces */
        if (card?.rank.position === 1) {
            cardHandled = handleUpdateLake({ destination: lake.findIndex(pile => !pile.length) })
            if (cardHandled) return true
        }

        /* try river */
        if (source === 'river') {
            const isFoundationCard = foundationIndex != null
            const start = isFoundationCard ? foundationIndex : river[pileIndex].length - 1

            if (!isFoundationCard) {
                cardHandled = tryToPlaceInLake()
                if (cardHandled) return true
            }

            cardHandled = tryToPlaceInRiver(start)
            if (cardHandled) return true

            /* try lake */
        } else {
            cardHandled = tryToPlaceInLake()
            if (cardHandled) return true
            cardHandled = tryToPlaceInRiver()
            if (cardHandled) return true
        }

        /* unable to place card */
        return false
    }

    const dropCard = ({ card, cardRef, originator, foundationIndex }: DragProps) => {

        let [source, i] = originator.split('-')
        const sourceIndex = +i

        type HandleUpdateRiverProps = {
            destination: number;
            source: string;
            sourceIndex: number;
            start?: number;
        }

        interface Target {
            pile: Card[];
            location: string;
            index: number;
        }
    
        const determineDestination = (ref: HTMLDivElement) => {
            if (!ref) {
                console.error("Card reference does not exist.")
                throw new Error("cardRef has no current value or current value is incompatible")
            }
            
            const { bottom, top, right, left, height } = ref.getBoundingClientRect()
            let target: Target | null = null
    
            console.log("Dimensions:", ref.getBoundingClientRect())
            const findTarget = (repetitions: number, piles: Card[][], location: string): Target | null => {
                for (let i = 0; i < repetitions; i++) {
                    const values = document.getElementById(`${location}-${i}`)?.getBoundingClientRect()
                    let offset = 10
                    if (location === 'river') offset = (river[i].length * (height / 5)) + 10
                    console.log("Values:", values)
                    if (values && left < values.right + 10 && right > values.left - 10 && top < values.bottom + offset && bottom > values.top - 10) {
                        return {
                            pile: piles[i],
                            location: location,
                            index: i,
                        }
                    }
                }
                return null
            }
            
            target = findTarget(4 * players.length, lake, 'lake')
            
            if (!target) target = findTarget(4, river, 'river')
    
            console.log(">>> target", target)
            return target
        }    

        const checkCompatibility = (card: Card, target: Target) => {
            const topCard = target.pile[target.pile.length - 1]
            switch (target.location) {
                case 'lake':
                    if (!topCard) {
                        if (card.rank.position === 1) {
                            return true 
                        }
                        return false
                    }
                    const isOneMore = card.rank.position - 1 === topCard.rank.position
                    const isSameSuit = card.suit.name === topCard.suit.name
                    return isOneMore && isSameSuit
                case 'river':
                    if (!topCard) return true
                    const isOneLess = card.rank.position + 1 === topCard.rank.position
                    const isOppositeSuit = card.suit.type !== topCard.suit.type
                    return isOneLess && isOppositeSuit
                default:
                    throw new Error("Target is not a valid dropzone.")
            }
        }

        const determineSourceArray = (source: string) => {
            switch (source) {
                case 'nert': return nertStack
                case 'waste': return waste
                case 'river': return river[sourceIndex]
                default: throw new Error(`Invalid source: ${source}`)
            }
        }

        /**
         * handleUpdateRiver
         * @param param0    
         * {
         *   destination: index of the river pile that the card or stack should be dropped on,
         *   source: the card array from which to pull the card that is moving,
         *   start: (optional) the index of the card if it is a foundation card,
         * } 
         * @returns 
         */
        const handleUpdateRiver = ({
            destination,
            source,
            sourceIndex,
            start
        }: HandleUpdateRiverProps) => {
            const copyOfRiver = [...river]
            if (start != null) {
                copyOfRiver[destination].push(...copyOfRiver[sourceIndex].splice(start, copyOfRiver[sourceIndex].length))
            } else {
                let sourceArray = determineSourceArray(source)
                const cardToMove = sourceArray.pop()
                if (cardToMove) copyOfRiver[destination].push(cardToMove)
            }
            setRiver(copyOfRiver)
            return true
        }

        const handleUpdateLake = ({
            destination,
            source,
        }: {
            destination: number;
            source: string;
        }) => {
            let sourceArray = determineSourceArray(source)
            if (!sourceArray) return false
            const copyOfLake = [...lake]
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfLake[destination].push(cardToMove)
            setLake(copyOfLake)
            return true
        }

        let destination
        try {
            if (cardRef?.current) destination = determineDestination(cardRef.current)
            if (!destination) return
        } catch (err) {
            console.info(err)
            return
        }

        let compatible
        try {
            compatible = checkCompatibility(card, destination)
            if (!compatible) return
        } catch (err) {
            console.info(err)
            return
        }

        try {
            switch (destination.location) {
                case 'lake':
                    handleUpdateLake({ destination: destination.index, source })
                    break
                case 'river':
                    handleUpdateRiver({ destination: destination.index, source, sourceIndex, start: foundationIndex })
                    break
            }
        } catch (err) {
            console.info(err)
            return
        }

    }

    /* board */
    return (
        <Container className="flex h-full items-center pt-8 sm:pt-16" >
            <div className="rounded-2xl sm:border sm:border-zinc-100 sm:p-8 sm:dark:border-zinc-700/40">
                {/* lake */}
                <Lake numberOfPlayers={players.length} lake={lake} />
                {/* tableau */}
                <Tableau river={river} nertStack={nertStack} playCard={playCard} onDragEnd={dropCard}/>
                {/* stream & waste */}
                <Stream stream={stream} waste={waste} maxWasteShowing={maxWasteShowing} playCard={playCard} wasteCards={wasteCards} nertStack={nertStack} onDragEnd={dropCard}/>
            </div>
        </Container>
    )
}