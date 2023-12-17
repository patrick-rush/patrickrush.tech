"use client"
import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { PlayingCard } from '@/components/PlayingCard'
import { useEffect, useMemo, useState } from 'react'

interface Suit {
    name: 'Hearts' | 'Clubs' | 'Diamonds' | 'Spades';
    symbol: '♥' | '♣' | '♦' | '♠';
    type: 0 | 1,
    color: 'red-800' | 'zinc-950';
}

interface Rank {
    display: string,
    name: string,
    position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
}

interface Card {
    suit: Suit;
    rank: Rank;
}

interface CommonPlayCardProps {
    card: Card;
}
type ConditionalPlayCardProps = | {
    source: 'river';
    pileIndex: number;
    foundationIndex?: number | null;
} | {
    source: 'waste' | 'nert';
    pileIndex?: never;
    foundationIndex?: never;
}

type PlayCardProps = CommonPlayCardProps & ConditionalPlayCardProps

const suits: Suit[] = [
    {
        name: 'Hearts',
        symbol: '♥',
        type: 0,
        color: 'red-800'
    },
    {
        name: 'Clubs',
        symbol: '♣',
        type: 1,
        color: 'zinc-950'
    },
    {
        name: 'Diamonds',
        symbol: '♦',
        type: 0,
        color: 'red-800'
    },
    {
        name: 'Spades',
        symbol: '♠',
        type: 1,
        color: 'zinc-950'
    },
]

const ranks: Rank[] = [
    {
        display: "A",
        name: "Ace",
        position: 1
    },
    {
        display: "2",
        name: "Two",
        position: 2
    },
    {
        display: "3",
        name: "Three",
        position: 3
    },
    {
        display: "4",
        name: "Four",
        position: 4
    },
    {
        display: "5",
        name: "Five",
        position: 5
    },
    {
        display: "6",
        name: "Six",
        position: 6
    },
    {
        display: "7",
        name: "Seven",
        position: 7
    },
    {
        display: "8",
        name: "Eight",
        position: 8
    },
    {
        display: "9",
        name: "Nine",
        position: 9
    },
    {
        display: "10",
        name: "Ten",
        position: 10
    },
    {
        display: "J",
        name: "Jack",
        position: 11
    },
    {
        display: "Q",
        name: "Queen",
        position: 12
    },
    {
        display: "K",
        name: "King",
        position: 13
    },
]

export default function Nerts() {
    "use client"
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [river, setRiver] = useState<Card[][]>([[], [], [], []])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [players, setPlayers] = useState([{}, {},])
    const [lake, setLake] = useState<Card[][]>(Array.from({ length: 4 * players.length }, () => []))
    const [gameOver, setGameOver] = useState<boolean>(false)

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
    }, [deck, players.length])

    const wasteCard = () => {
        if (gameOver) return
        const streamLength = stream.length
        let topOfStream
        if (stream.length >= 3) topOfStream = stream.splice(streamLength - 3)
        else topOfStream = stream.splice(0)
        if (topOfStream.length > 0) {
            const newWaste = [...waste, ...topOfStream]
            setWaste(newWaste)
        } else {
            setStream(waste.reverse())
            setWaste([])
        }
    }
    
    const playCard = (props: PlayCardProps) => {
        const { card, source, pileIndex, foundationIndex } = props
        
        if (gameOver) return

        const handleRiverUpdate = ({
            destination,
            source,
            start
        }: {
            destination: number;
            source: string;
            start?: never;
        } | {
            destination: number;
            source: number;
            start: number;
        }) => {
            const copyOfRiver = [...river]
            if (typeof source === 'string') {
                let sourceArray: Card[]
                switch (source) {
                    case 'nert':
                        sourceArray = nertStack
                        break
                    case 'waste':
                        sourceArray = waste
                        break
                    default:
                        cardHandled = true
                        return
                }
                const cardToMove = sourceArray.pop()
                if (cardToMove) copyOfRiver[destination].push(cardToMove)
            } else {
                copyOfRiver[destination].push(...copyOfRiver[source].splice(start!, copyOfRiver[source].length))
            }
            setRiver(copyOfRiver)
        }
    
        const handleLakeUpdate = ({
            destination,
        }: {
            destination: number;
        }) => {
            let sourceArray: Card[]
            switch (source) {
                case 'river':
                    sourceArray = river[pileIndex]
                    break
                case 'nert':
                    sourceArray = nertStack
                    break
                case 'waste':
                    sourceArray = waste
                    break
                default:
                    cardHandled = true
                    return
            }
            const copyOfLake = [...lake]
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfLake[destination].push(cardToMove)
            setLake(copyOfLake)
        }

        let cardHandled = false
        while (!cardHandled) {

            /* handle NERTS */
            if (source === 'nert' && nertStack.length === 0) {
                // GAME OVER
                
                setGameOver(true)
                cardHandled = true
                window.alert("GAME OVER")
                return
            }
            /* handle aces */
            if (card?.rank.position === 1) {
                handleLakeUpdate({ destination: lake.findIndex(pile => !pile.length) })

                cardHandled = true
                break
            }

            if (source === 'river') {
                let start
                const isFoundationCard = foundationIndex != null

                /* check lake */
                if (!isFoundationCard) {
                    start = river[pileIndex].length - 1

                    for (let i = 0; i < lake.length; i++) {
                        const pile = lake[i]

                        if (pile.length === 0) continue

                        const isOneMore = card.rank.position - 1 === pile[pile.length - 1].rank.position
                        const isSameSuit = card.suit.name === pile[0].suit.name

                        if (isOneMore && isSameSuit) {
                            handleLakeUpdate({
                                destination: i,
                            })
                            cardHandled = true
                            break
                        }
                    }
                } else start = foundationIndex

                for (let i = 0; i < river.length; i++) {
                    const pile = river[i]

                    if (i === pileIndex) continue
                    if (pile.length === 0) continue

                    const isOneLess = card.rank.position + 1 === pile[pile.length - 1].rank.position
                    const isOppositeSuit = card.suit.type !== pile[pile.length - 1].suit.type

                    if (isOneLess && isOppositeSuit) {
                        handleRiverUpdate({
                            destination: i,
                            source: pileIndex,
                            start
                        })
                        cardHandled = true
                        break
                    }
                }

                for (let i = 0; i < river.length; i++) {
                    const pile = river[i]
                    if (i === pileIndex) continue
                    if (pile.length !== 0) continue
                    handleRiverUpdate({
                        destination: i,
                        source: pileIndex,
                        start
                    })
                    cardHandled = true
                    break
                }

                cardHandled = true
                break
            } else {
                /* try lake */
                for (let i = 0; i < lake.length; i++) {
                    const pile = lake[i]
                    if (pile.length === 0) continue
                    const isOneMore = card.rank.position - 1 === pile[pile.length - 1].rank.position
                    const isSameSuit = card.suit.name === pile[0].suit.name
                    if (isOneMore && isSameSuit) {
                        handleLakeUpdate({
                            destination: i,
                        })
                        cardHandled = true
                        return
                    }
                }

                /* try river */
                for (let i = 0; i < river.length; i++) {
                    const pile = river[i]

                    if (pile.length === 0) continue

                    const isOneLess = card.rank.position + 1 === pile[pile.length - 1].rank.position
                    const isOppositeSuit = card.suit.type !== pile[pile.length - 1].suit.type

                    if (isOneLess && isOppositeSuit) {
                        handleRiverUpdate({
                            destination: i,
                            source,
                        })
                        cardHandled = true
                        return
                    }
                }

                for (let i = 0; i < river.length; i++) {
                    const pile = river[i]

                    if (pile.length !== 0) continue

                    handleRiverUpdate({
                        destination: i,
                        source,
                    })

                    cardHandled = true
                    return
                }
                cardHandled = true
                break
            }
        }
    }

    const calculateOffset = (index: number, totalLength: number) => {
        if (totalLength < 3) {
            return index * 40;
        }

        const distanceFromEnd = totalLength - 1 - index;
        return distanceFromEnd < 3 ? 80 - Math.abs(distanceFromEnd * 40) : 0;
    };

    /* board */
    return (
        <Container className="flex h-full items-center pt-8 sm:pt-16">
            <div className="rounded-2xl border border-zinc-100 p-8 dark:border-zinc-700/40">
                {/* lake */}
                <div id="lake" className="grid grid-cols-4 pb-8 place-items-center ">
                    {Array.from({ length: (players.length * 4) }).map((_, index) => {
                        const pile = lake[index]
                        return (
                            <div id={`lake-${index}`} key={index} className="w-16 h-24 md:w-32 md:h-48 my-4 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                                {pile?.map((card, cardIndex) => (
                                    <PlayingCard className={`z-[${cardIndex}]`} key={cardIndex} suit={card.suit} rank={card.rank} isShowing={true} />
                                ))}
                            </div>
                        )
                    })}
                </div>
                {/* tableau */}
                <div id="tableau" className="flex flex-wrap justify-between pb-16">
                    {/* river */}
                    {river.map((_, riverIndex) => (
                        <div key={riverIndex} id={`river-${riverIndex + 1}`}>
                            <div className="" style={{ height: `${192 + 40 * (Math.max(...river.map(pile => pile.length)) - 1)}px` }}>
                                <div className="relative w-16 h-24 md:w-32 md:h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                                    {river[riverIndex].map((card, cardIndex) => (
                                        <div key={cardIndex} className="absolute" style={{ top: `${40 * cardIndex}px` }} >
                                            <PlayingCard
                                                className={`z-[${cardIndex}]`}
                                                suit={card.suit}
                                                rank={card.rank}
                                                isShowing={true}
                                                onClick={() => playCard({
                                                    card,
                                                    source: "river",
                                                    pileIndex: riverIndex,
                                                    foundationIndex: ((cardIndex < river[riverIndex].length - 1) ? cardIndex : null)
                                                })} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* nert stack */}
                    <div id="nert" className="">
                        <div
                            className="w-16 h-24 md:w-32 md:h-48 md:ml-16 outline outline-teal-500 dark:outline-teal-400 outline-offset-4 rounded-md dark:outline-zinc-700/40"
                            onClick={() => playCard({
                                card: nertStack[nertStack.length - 1],
                                source: "nert"
                            })
                            }>
                            <div className="absolute w-16 h-24 md:w-32 md:h-48 text-teal-500 dark:text-teal-400 flex justify-center items-center select-none">
                                <span className="text-xl md:text-3xl font-bold">NERTS</span>
                            </div>
                            {nertStack.map((card, index) => (
                                <PlayingCard className={`z-[${index}]`} key={index} suit={card.suit} rank={card.rank} isShowing={true} />
                            ))}
                        </div>
                    </div>
                </div>
                {/* stream & waste */}
                <div id="stream-and-waste" className="flex justify-center ">
                    {/* stream */}
                    <div id="stream" className="mx-8">
                        <div className="w-16 h-24 md:w-32 md:h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40" onClick={wasteCard}>
                            {stream.map((card, index) => (
                                <PlayingCard className={`z-[${index}]`} key={index} suit={card.suit} rank={card.rank} isShowing={false} />
                            ))}
                        </div>
                    </div>
                    {/* waste */}
                    <div id="waste" className="mx-8">
                        <div
                            className="relative w-16 h-24 md:w-32 md:h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40"
                            onClick={() => playCard({ card: waste[waste.length - 1], source: 'waste' })}
                        >
                            {waste.map((card, index) => {
                                let offset = calculateOffset(index, waste.length)
                                return (
                                    <div key={index} className="absolute" style={{ left: `${offset}px` }}>
                                        <PlayingCard className={`z-[${index}]`} suit={card.suit} rank={card.rank} isShowing={true} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}


