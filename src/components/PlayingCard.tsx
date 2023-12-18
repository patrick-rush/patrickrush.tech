"use client"
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import React from 'react'
import type { Suit, Rank } from '@/types/nerts'

type PlayingCardProps = {
  className?: string
  suit: Suit;
  rank: Rank;
  isShowing: boolean;
  onClick?: () => void;
  cardPosition?: DOMRect | undefined;
}

export function PlayingCard({
  className,
  suit,
  rank,
  isShowing,
  onClick,
  cardPosition
}: PlayingCardProps) {
  "use client"
  
  return (
    <div className={clsx(className, "absolute")} onClick={onClick}>
      <div
        className="group relative flex flex-col items-start select-none"
        onClick={onClick}
      >
        <div hidden className="border-0 border-zinc-950 border-red-800 text-zinc-950 text-red-800"></div>
        {/* {children} */}
        {isShowing ?
          <div className={`w-16 h-24 md:w-24 md:h-36 bg-white rounded-md flex flex-col justify-between p-2`}>
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
          <div className="w-16 h-24 md:w-24 md:h-36 absolute rounded-md">
            <Image draggable="false" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={cardBack} className={clsx(className, "rounded-md")} alt="reverse of playing card" />
          </div>
        }
      </div>
    </div>
  )
}