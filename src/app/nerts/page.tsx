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

// export const metadata: Metadata = {
//   title: 'Nerts',
//   description:
//     "Let's play the greatest game of all time!",
// }

export default function Nerts() {
    "use client"
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [riverOne, setRiverOne] = useState<Card[]>([])
    const [riverTwo, setRiverTwo] = useState<Card[]>([])
    const [riverThree, setRiverThree] = useState<Card[]>([])
    const [riverFour, setRiverFour] = useState<Card[]>([])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [lake, setLake] = useState<Card[][]>([])
    const [players, setPlayers] = useState([{}, {}])

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
        setRiverOne(shuffledDeck.splice(0, 1))
        setRiverTwo(shuffledDeck.splice(0, 1))
        setRiverThree(shuffledDeck.splice(0, 1))
        setRiverFour(shuffledDeck.splice(0, 1))
        setStream(shuffledDeck)
        console.log(">>> nertStack", nertStack)
        console.log(">>> riverOne", riverOne)
        console.log(">>> riverTwo", riverTwo)
        console.log(">>> riverThree", riverThree)
        console.log(">>> riverFour", riverFour)
        console.log(">>> stream", stream)
        console.log(">>> waste", waste)
        console.log(">>> lake", lake)
    }, [])

    const wasteCard = () => {
        const topOfStream = stream.pop()
        if (topOfStream) {
            const newWaste = [...waste, topOfStream]
            setWaste(newWaste)
        } else {
            setStream(waste.reverse())
            setWaste([])
        }
    }

    useEffect(() => {
        console.log("after", waste)
    }, [waste])

    return (
        /* board */
        <Container className="flex h-full items-center pt-8 sm:pt-16">
            <div className="rounded-2xl border border-zinc-100 p-8 dark:border-zinc-700/40">
                {/* lake */}
                <div id="lake" className="grid grid-cols-4 pb-8 place-items-center ">
                    {/* Dynamically generated lake piles */}
                    {Array.from({ length: (players.length * 4) }).map((_, index) => {
                        const pile = lake[index]
                        return (
                            <div id={`lake-${index}`} key={index} className="w-32 h-48 my-4 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                                {pile?.map((card, cardIndex) => (
                                    <PlayingCard className={`z-${cardIndex}`} key={cardIndex} suit={card.suit} rank={card.rank} visible={false} />
                                ))}
                            </div>
                        )
                    })}
                </div>
                {/* tableau */}
                <div id="tableau" className="flex justify-between pb-32">
                    <div id="nert" className="">
                        {/* Nert pile */}
                        <div id="nert">
                            <div className="w-32 h-48 mr-16 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                                {nertStack.map((card, index) => (
                                    <PlayingCard className={`absolute z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div id="river-1">
                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {riverOne.map((card, index) => (
                                <PlayingCard className={`z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                            ))}
                        </div>
                    </div>
                    <div id="river-2">
                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {riverTwo.map((card, index) => (
                                <PlayingCard className={`z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                            ))}
                        </div>

                    </div>
                    <div id="river-3">
                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {riverThree.map((card, index) => (
                                <PlayingCard className={`z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                            ))}
                        </div>

                    </div>
                    <div id="river-4">
                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {riverFour.map((card, index) => (
                                <PlayingCard className={`z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                            ))}
                        </div>
                    </div>
                </div>
                {/* stream / waste */}
                <div id="stream-and-waste" className="flex justify-center ">
                    <div id="stream" className="mx-8">

                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40" onClick={wasteCard}>
                            {stream.map((card, index) => (
                                <PlayingCard className={`z-${index}`} key={index} suit={card.suit} rank={card.rank} visible={false} />
                            ))}
                        </div>

                    </div>
                    <div id="waste" className="mx-8">
                        <div className="w-32 h-48 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {waste.map((card, index) => (
                                <PlayingCard className={`absolute z-[${index}]`} key={index} suit={card.suit} rank={card.rank} visible={true} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}


