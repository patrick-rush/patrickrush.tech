"use client"
import { MutableRefObject, RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks } from '@/constants/nerts'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { WasteAndStream } from '@/components/WasteAndStream'
import type { Card, PlayCardProps } from '@/types/nerts.d'
import type { PanInfo } from "framer-motion"

export default function Nerts() {
    "use client"
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [river, setRiver] = useState<Card[][]>([[], [], [], []])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [players, setPlayers] = useState([{}, {},])
    const [lake, setLake] = useState<Card[][]>(Array.from({ length: 4 * players.length }, () => []))
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [nertStackPosition, setNertStackPosition] = useState<DOMRect | undefined>()
    const [riverPositions, setRiverPositions] = useState<Map<number, DOMRect> | undefined>()
    const [streamPosition, setStreamPosition] = useState<DOMRect | undefined>()
    const [wastePosition, setWastePosition] = useState<DOMRect | undefined>()
    const [lakePositions, setLakePositions] = useState<Map<number, DOMRect> | undefined>()
    const maxWasteShowing = useRef(0)
    const boardRef = useRef(null)

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
        setNertStackPosition(document.getElementById('nert')?.getBoundingClientRect())
        setStreamPosition(document.getElementById('stream')?.getBoundingClientRect())
        setWastePosition(document.getElementById('waste')?.getBoundingClientRect())
        const riverPositions = new Map()
        for (let i = 1; i <= 4; i++) {
            riverPositions.set(i, document.getElementById(`river-${i}`)?.getBoundingClientRect())
        }
        setRiverPositions(riverPositions)
        const lakePositions = new Map()
        for (let i = 0; i < 4 * players.length; i++) {
            lakePositions.set(i, document.getElementById(`lake-${i}`)?.getBoundingClientRect())
        }
        setLakePositions(lakePositions)
        maxWasteShowing.current = 0
    }, [deck, players.length])

    // useEffect(() => {
    //     console.log(">>> nertStack", nertStack)
    //     console.log(">>> river", river)
    //     console.log(">>> stream", stream)
    //     console.log(">>> waste", waste)
    //     console.log(">>> players", players)
    //     console.log(">>> lake", lake)
    //     console.log(">>> gameOver", gameOver)
    //     console.log(">>> nertStackPosition", nertStackPosition)
    //     console.log(">>> riverPositions", riverPositions)
    //     console.log(">>> streamPosition", streamPosition)
    //     console.log(">>> wastePosition", wastePosition)
    //     console.log(">>> ?", lakePositions)
    // }, [
    //     nertStack,
    //     river,
    //     stream,
    //     waste,
    //     players,
    //     lake,
    //     gameOver,
    //     nertStackPosition,
    //     riverPositions,
    //     streamPosition,
    //     wastePosition,
    //     lakePositions
    // ])

    const wasteCards = () => {
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
    }

    const playCard = (props: PlayCardProps) => {
        console.log("she was clicked yall")
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

    const handleDragAndDrop = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardRef: RefObject<HTMLDivElement>, originator: string) => {

        console.log("at least we got here")
        let [source, i] = originator.split('-')
        const index = parseInt(i)
        // figure out if we dropped the element in a target
            /* 
                targets are:
                    rivers
                    lakes
            */
        // if not, do nothing, return card to original position

        const getSourceArray = (source: string) => {
            switch (source) {
                case 'nert': return nertStack
                case 'waste': return waste
                case 'river': return river[index!]
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

        if (cardRef?.current) {
            const { x, y, width, height } = cardRef.current.getBoundingClientRect()
            let targetFound = false
            let target
            let location
            let index
            if (lakePositions) {
                for (let [key, value] of lakePositions) {
                    if (value && x + width > value.x && y + height > value.y &&  x < value.x + width && y < value.y + width) {
                        target = lake[key]
                        targetFound = true
                        location = 'lake'
                        index = key
                        break
                    }
                }
            }
            if (!targetFound && riverPositions) {
                for (let [key, value] of riverPositions) {
                    if (value && x + width > value.x && y + height > value.y &&  x < value.x + width && y < value.y + width) {
                        target = river[key]
                        targetFound = true
                        location = 'river'
                        index = key
                        break
                    }
                }
            }
            if (target && typeof index === 'number') {
                switch (location) {
                    case 'lake':
                        handleUpdateLake({ destination: index })
                        break
                    case 'river':
                        handleUpdateRiver({ destination: index, source })
                        break
                }
            }
            // if (target && x + width > target.x && y + height > target.y &&  x < target.x + width && y < target.y + width) {
            //     console.log("we gon drop")
            // }
        }

        // loop through coordinates, if info.point falls in the bounds of coordinates, see if card can be dropped there. If not, return to origin
        // we need to know, 
    }

    /* board */
    return (
        <Container className="flex h-full items-center pt-8 sm:pt-16" >
            <div className="rounded-2xl border border-zinc-100 p-8 dark:border-zinc-700/40" ref={boardRef}>
                {/* lake */}
                <Lake numberOfPlayers={players.length} lake={lake} />
                {/* tableau */}
                <Tableau river={river} nertStack={nertStack} playCard={playCard} boardRef={boardRef} onDragEnd={handleDragAndDrop}/>
                {/* stream & waste */}
                <WasteAndStream stream={stream} waste={waste} maxWasteShowing={maxWasteShowing} playCard={playCard} wasteCards={wasteCards} boardRef={boardRef} onDragEnd={handleDragAndDrop}/>
            </div>
        </Container>
    )
}