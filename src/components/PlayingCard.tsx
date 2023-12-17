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

export function PlayingCard<T extends React.ElementType>({
    className,
    suit,
    rank,
    isShowing,
    onClick,
    cardPosition
    // children,
  }: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
    className?: string
    suit: Suit;
    rank: Rank;
    isShowing: boolean;
    onClick?: () => void;
    cardPosition?: DOMRect | undefined;
  }) {
    "use client"

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