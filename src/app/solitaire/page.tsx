"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks, CardSource, Rank } from '@/constants/solitaire'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { Stream } from '@/components/Stream'
import type { Card, PlayCardProps, DropCardProps, HandleUpdateRiverProps, GetSourceArrayProps } from '@/types/solitaire'
import { LayoutGroup } from 'framer-motion'
import useScreenSize from '@/lib/useScreenSize'

export default function Solitaire() {
    "use client"
    const [river, setRiver] = useState<Card[][]>(Array.from({ length: 7 }, () => []))
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [lake, setLake] = useState<Card[][]>(Array.from({ length: 4 }, () => []))
    const [lastInLake, setLastInLake] = useState<{ card: Card } | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const maxWasteShowing = useRef(0)
    const screenSize = useScreenSize()

    const deck = useMemo(() => suits.flatMap(suit => {
        return ranks.map(rank => {
            return {
                suit,
                rank,
                flipped: true,
            };
        });
    }), [])

    const shuffle = (array: any[]) => array.sort((a, b) => 0.5 - Math.random())

    useEffect(() => {
        let shuffledDeck: Card[] = shuffle(deck)
        setWaste([])
        setStream(shuffledDeck.splice(0, 24))
        let river: Card[][] = []
        for (let i = 0; i < 7; i++) {
            let pile: Card[] = []
            pile.push(...shuffledDeck.splice(0, i).map((card: Card) => {
                card.flipped = false
                return card
            }))
            if (shuffledDeck.length) pile.push(shuffledDeck.shift()!)
            river.push(pile)
        }
        setRiver(river)
        maxWasteShowing.current = 0
    }, [deck])

    const wasteCards = useCallback(() => {
        if (gameOver) return

        const streamLength = stream.length
        let topOfStream

        if (stream.length >= 3) topOfStream = stream.splice(streamLength - 3).reverse()
        else topOfStream = stream.splice(0).reverse()

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
            case CardSource.Lake:
                if (!stationaryCard) return movingCard.rank.position === 1
                const isOneMore = movingCard.rank.position - 1 === stationaryCard.rank.position
                const isSameSuit = movingCard.suit.name === stationaryCard.suit.name
                return isOneMore && isSameSuit
            case CardSource.River:
                if (!stationaryCard) return movingCard.rank.position === 13
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
            case CardSource.Waste: return waste
            case CardSource.Lake: return lake[pileIndex!]
            case CardSource.River: return river[pileIndex!]
            default: throw new Error(`Invalid source: ${source}`)
        }
    }, [river, lake, waste])

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
            const props: { source: CardSource.Waste | CardSource.Lake | CardSource.River; pileIndex?: number; } = { source }
            if (source === CardSource.River || source === CardSource.Lake) props.pileIndex = sourceIndex
            let sourceArray = getSourceArray(props as GetSourceArrayProps)
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfRiver[destination].push(cardToMove)
        }
        if (sourceIndex && copyOfRiver[sourceIndex].length) copyOfRiver[sourceIndex][copyOfRiver[sourceIndex].length - 1].flipped = true
        setRiver(copyOfRiver)
        return true
    }

    const handleUpdateLake = ({
        destination,
        source,
        sourceIndex,
    }: {
        destination: number;
        source: CardSource.Waste | CardSource.River | CardSource.Lake;
        sourceIndex?: number;
    }) => {
        let sourceArray
        if (source === CardSource.River || source === CardSource.Lake) sourceArray = getSourceArray({ source, pileIndex: sourceIndex! })
        else sourceArray = getSourceArray({ source })
        if (!sourceArray) return false
        const copyOfLake = [...lake]
        const cardToMove = sourceArray.pop()
        if (cardToMove) {
            copyOfLake[destination].push(cardToMove)
            setLastInLake({ card: cardToMove })
            if (source === CardSource.River && sourceArray.length) sourceArray[sourceArray.length - 1].flipped = true
        }
        setLake(copyOfLake)
        return true
    }

    // GAME OVER
    const endGame = () => {
        setGameOver(true)
        window.alert("GAME OVER")
    }

    const playCard = (props: PlayCardProps) => {
        if (gameOver) return

        const { card, source, pileIndex, foundationIndex } = props

        const tryToPlaceInLake = () => {
            return lake.some((pile, i) => {
                if (pile.length === 0) return false

                if (isCompatible(CardSource.Lake, card, pile[pile.length - 1])) return handleUpdateLake({ destination: i, source, sourceIndex: pileIndex })
                else return false
            })
        }

        const tryToPlaceInRiver = (start?: number) => {

            const placeCard = (index: number) => {
                if (source === CardSource.River) return handleUpdateRiver({ destination: index, source, sourceIndex: pileIndex!, start })
                else return handleUpdateRiver({ destination: index, source, sourceIndex: pileIndex })
            }

            const tryToPlaceOnPile = () => {
                return river.some((pile, i) => {
                    if (isCompatible(CardSource.River, card, pile[pile.length - 1])) return placeCard(i)
                    else return false
                })
            }

            return tryToPlaceOnPile()

        }

        let cardHandled = false

        /* handle aces */
        if (card?.rank.position === 1) {
            cardHandled = handleUpdateLake({ destination: lake.findIndex(pile => !pile.length), source, sourceIndex: pileIndex })
            if (cardHandled) return true
        }

        /* try river */
        if (source === CardSource.River) {
            const isFoundationCard = foundationIndex != null
            const start = isFoundationCard ? foundationIndex : river[pileIndex!].length - 1

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
            const findTarget = (repetitions: number, piles: Card[][], location: string, source: CardSource, pileIndex?: number): Target | null => {
                for (let i = 0; i < repetitions; i++) {
                    if (location === source && pileIndex === i) continue
                    let domId: string = `${location}-${i}`
                    const values = document.getElementById(domId)?.getBoundingClientRect()
                    let offset = 10
                    if (location === CardSource.River) offset = (river[i].length * (height / 5)) + 10
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
            
            target = findTarget(4, lake, CardSource.Lake, source, pileIndex)
            console.log(">>> target", target)

            if (!target) target = findTarget(7, river, CardSource.River, source, pileIndex)

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
            if (destination.location === CardSource.Lake) handleUpdateLake({ destination: destination.index, source, sourceIndex: pileIndex })
            if (destination.location === CardSource.River) {
                if (source === CardSource.River) handleUpdateRiver({ destination: destination.index, source, sourceIndex: pileIndex!, start: foundationIndex })
                if (source === CardSource.Lake) handleUpdateRiver({ destination: destination.index, source, sourceIndex: pileIndex! })
                else handleUpdateRiver({ destination: destination.index, source })
            }
        } catch (err) {
            console.info(err)
            return
        }
    }

    const board = (
        <LayoutGroup >
            <div className="rounded-2xl sm:border sm:border-zinc-100 sm:p-8 sm:dark:border-zinc-700/40">
                {/* lake */}
                <Lake lake={lake} playCard={playCard} onDragEnd={dropCard} />
                {/* tableau */}
                <Tableau river={river} playCard={playCard} onDragEnd={dropCard} />
                {/* stream & waste */}
                <Stream stream={stream} waste={waste} maxWasteShowing={maxWasteShowing} playCard={playCard} wasteCards={wasteCards} onDragEnd={dropCard} />
            </div>
        </LayoutGroup>
    )

    /* board */
    return (
        <>
            {screenSize.width && screenSize.width < 1024
            ? <div className="p-2 sm:p-16">
                {board}
            </div>
            : <Container className="h-full items-center pt-4 sm:pt-16" >
                {board}
            </Container>}
        </>
    )
}