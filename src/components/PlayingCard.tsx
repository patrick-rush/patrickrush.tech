"use client"
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '@/lib/Constants'


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

// const suits: Suit[] = [
//     {
//       name: 'Hearts',
//       symbol: '♥',
//       type: 0,
//       color: 'red-800'
//     },
//     {
//       name: 'Clubs',
//       symbol: '♣',
//       type: 1,
//       color: 'zinc-950'
//     },
//     {
//       name: 'Diamonds',
//       symbol: '♦',
//       type: 0,
//       color: 'red-800'
//     },
//     {
//       name: 'Spades',
//       symbol: '♠',
//       type: 1,
//       color: 'zinc-950'
//     },
//   ]
  

  

//   const ranks = [
//     "A",
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "7",
//     "8",
//     "9",
//     "10",
//     "J",
//     "Q",
//     "K",
//   ]

    // const deck = suits.map(suit => {
    //   return ranks.map(rank => {
    //     return {
    //         suit,
    //         rank,
    //     };
    //   });
    // });

    // console.log(">>> deck", deck)

//   const deck = [
//       {
//           suit: Suit[1],
//           rank: Rank[1],
//       },
//       {
//           suit: Suit[3],
//           rank: Rank[7],
//       }
//   ]

export function PlayingCard<T extends React.ElementType>({
    className,
    suit,
    rank,
    isShowing,
    onClick,
    // children,
  }: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
    className?: string
    suit: Suit;
    rank: Rank;
    isShowing: boolean;
    onClick?: () => void;
  }) {
    "use client"
    // const [isShowing, setIsShowing] = useState(visible)
    // const [isFlipping, setIsFlipping] = useState(false)
  
    const handleClick = () => {
        if (isShowing) return
        // setIsShowing(true)
        // setIsFlipping(true)
        // setTimeout(() => setIsShowing(!isShowing), 125)
        // setTimeout(() => setIsFlipping(false), 250)
    }

    const handleStart = () => {
      console.log(">>> handleStart")
    } 
    const handleDrag = () => {
      console.log(">>> handleDrag")
    } 
    const handleStop = (e: any) => {
      console.log(">>> handleStop", e)
    } 
    
    return (

          // <div className={clsx(className, 'select-none', { 'mirror': isFlipping })} onClick={onClick}>
          <div className={className} onClick={onClick}>
            <div className="absolute">
              <div
                // className={clsx('group relative flex flex-col items-start', { 'animate-flip-slow': isFlipping })}
                className="group relative flex flex-col items-start select-none"
                onClick={onClick}
              >
                <div hidden className="border-0 border-zinc-950 border-red-800 text-zinc-950 text-red-800"></div>
                {/* {children} */}
                {isShowing ? 
                  <div className={`w-16 h-24 md:w-32 md:h-48 bg-white border-2 border-${suit.color} rounded-md flex flex-col justify-between p-2`}>
                    <div className="flex justify-between">
                        <div className={`text-${suit.color}`}>
                            <p className="text-lg font-bold">{rank.display}</p>
                        </div>
                        <div className={`text-${suit.color}`}>
                            <p className="text-lg font-bold">{suit.symbol}</p>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <div className={`text-${suit.color} text-5xl font-bold`}>{suit.symbol}</div>
                    </div>
                    <div className="hidden md:flex justify-between">
                        <div className={`text-${suit.color} rotate-180`}>
                            <p className="text-lg font-bold">{suit.symbol}</p>
                        </div>
                        <div className={`text-${suit.color} rotate-180`}>
                            <p className="text-lg font-bold">{rank.display}</p>
                        </div>
                    </div>
                  </div>
                  :
                  <div className="w-16 h-24 md:w-32 md:h-48 absolute rounded-md">
                      <Image draggable="false" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={cardBack} className="border-2 border-white rounded-md drop-shadow-md" alt="reverse of playing card"/>
                  </div>
                  }
              </div>
            </div>
          </div>
    )
  }