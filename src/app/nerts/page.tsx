"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks } from '@/constants/nerts'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { Stream } from '@/components/Stream'
import type { Card, PlayCardProps, DropCardProps, HandleUpdateRiverProps, GetSourceArrayProps } from '@/types/nerts.d'
import { LayoutGroup } from 'framer-motion'

interface Player {
    displayName: string;
    id: string;
}

export default function Nerts() {
    "use client"
    const [players, setPlayers] = useState<Player[]>([{
        displayName: 'Patrick',
        id: 'ec16fc8e-7e79-49ee-bd83-98b191e0ca72',
    }, {
        displayName: 'Esther',
        id: 'cb98ca55-3fde-407c-8489-cc900977a92a',
    },])
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [river, setRiver] = useState<Card[][]>([[], [], [], []])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [lake, setLake] = useState<Card[][]>(Array.from({ length: 4 * players.length }, () => []))
    const [lastInLake, setLastInLake] = useState<{ player: Player, card: Card } | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const maxWasteShowing = useRef(0)
    const currentPlayer = players[0]

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

    const isCompatible = (boardArea: string, movingCard: Card, stationaryCard?: Card) => {
        switch (boardArea) {
            case 'lake':
                if (!stationaryCard) return movingCard.rank.position === 1
                const isOneMore = movingCard.rank.position - 1 === stationaryCard.rank.position
                const isSameSuit = movingCard.suit.name === stationaryCard.suit.name
                return isOneMore && isSameSuit
            case 'river':
                if (!stationaryCard) return true
                const isOneLess = movingCard.rank.position + 1 === stationaryCard.rank.position
                const isOppositeSuit = movingCard.suit.type !== stationaryCard.suit.type
                return isOneLess && isOppositeSuit
            default:
                throw new Error("Target is not a valid dropzone.")
        }
    }

    const getSourceArray = useCallback((props: GetSourceArrayProps) => {
        const { source, pileIndex } = props
        switch (source) {
            case 'nert': return nertStack
            case 'waste': return waste
            case 'river': return river[pileIndex!]
            default: throw new Error(`Invalid source: ${source}`)
        }
    }, [nertStack, river, waste])

    const handleUpdateRiver = ({
        destination,
        source,
        sourceIndex,
        start
    }: HandleUpdateRiverProps) => {
        const copyOfRiver = [...river]
        if (start != null && sourceIndex != null) {
            copyOfRiver[destination].push(...copyOfRiver[sourceIndex!].splice(start, copyOfRiver[sourceIndex!].length))
        } else {
            const props: { source: 'nert' | 'waste' | 'river'; pileIndex?: number; } = { source }
            if (source === 'river') props.pileIndex = sourceIndex
            let sourceArray = getSourceArray(props as GetSourceArrayProps)
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfRiver[destination].push(cardToMove)
        }
        setRiver(copyOfRiver)
        return true
    }

    const handleUpdateLake = ({
        destination,
        source,
        sourceIndex,
    }: {
        destination: number;
        source: 'nert' | 'waste' | 'river';
        sourceIndex?: number;
    }) => {
        let sourceArray
        if (source === 'river') sourceArray = getSourceArray({ source, pileIndex: sourceIndex! })
        else sourceArray = getSourceArray({ source })
        if (!sourceArray) return false
        const copyOfLake = [...lake]
        const cardToMove = sourceArray.pop()
        if (cardToMove) {
            copyOfLake[destination].push(cardToMove)
            setLastInLake({ player: currentPlayer, card: cardToMove})
        }
        setLake(copyOfLake)
        return true
    }

    const playCard = (props: PlayCardProps) => {
        if (gameOver) return

        const { card, source, pileIndex, foundationIndex } = props
        
        /* handle NERTS */
        if (source === 'nert' && nertStack.length === 0) {
            // GAME OVER
            setGameOver(true)
            window.alert("GAME OVER")
            return true
        }

        const tryToPlaceInLake = () => {
            return lake.some((pile, i) => {
                if (pile.length === 0) return false
                
                if (isCompatible('lake', card, pile[pile.length - 1])) return handleUpdateLake({ destination: i, source, sourceIndex: pileIndex })
                else return false
            })
        }

        const tryToPlaceInRiver = (start?: number) => {

            const placeCard = (index: number) => {
                let updateObject: HandleUpdateRiverProps

                updateObject = source === 'river' ? { destination: index, source, sourceIndex: pileIndex, start } : { destination: index, source, sourceIndex: pileIndex }
                return handleUpdateRiver(updateObject)
            }

            const tryToPlaceOnPile = () => {
                return river.some((pile, i) => {
                    if (i === pileIndex || pile.length === 0) return false

                    if (isCompatible('river', card, pile[pile.length - 1])) return placeCard(i)
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

        /* handle aces */
        if (card?.rank.position === 1) {
            cardHandled = handleUpdateLake({ destination: lake.findIndex(pile => !pile.length), source, sourceIndex: pileIndex })
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

    const dropCard = ({ card, cardRef, source, pileIndex, foundationIndex }: DropCardProps) => {

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
            const topCard = destination.pile[destination.pile.length - 1]
            compatible = isCompatible(destination.location, card, topCard)
            if (!compatible) return
        } catch (err) {
            console.info(err)
            return
        }

        try {
            if (destination.location === 'lake') handleUpdateLake({ destination: destination.index, source, sourceIndex: pileIndex })
            if (destination.location === 'river'){
                const props: {
                    destination: number;
                    source: 'nert' | 'waste' | 'river';
                    sourceIndex?: number;
                    start?: number | null
                } = { destination: destination.index, source }
                if (source === 'river') {
                    props.sourceIndex = pileIndex
                    props.start = foundationIndex
                }
                handleUpdateRiver(props as HandleUpdateRiverProps)
            }
        } catch (err) {
            console.info(err)
            return
        }
    }

    /* board */
    return (
        <Container className="flex h-full items-center pt-8 sm:pt-16" >
            <LayoutGroup >
                <div className="rounded-2xl sm:border sm:border-zinc-100 sm:p-8 sm:dark:border-zinc-700/40">
                    {/* lake */}
                    <Lake numberOfPlayers={players.length} lake={lake} lastInLake={lastInLake} />
                    {/* tableau */}
                    <Tableau river={river} nertStack={nertStack} playCard={playCard} onDragEnd={dropCard}/>
                    {/* stream & waste */}
                    <Stream stream={stream} waste={waste} maxWasteShowing={maxWasteShowing} playCard={playCard} wasteCards={wasteCards} nertStack={nertStack} onDragEnd={dropCard}/>
                </div>
            </LayoutGroup>
        </Container>
    )
}