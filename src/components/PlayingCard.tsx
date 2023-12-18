"use client"
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import React, { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'
import type { Suit, Rank } from '@/types/nerts'
import { motion } from "framer-motion"
import type { PanInfo } from "framer-motion"

type PlayingCardProps = {
  className?: string
  suit: Suit;
  rank: Rank;
  isShowing: boolean;
  cardPosition?: DOMRect | undefined;
  boardRef?: MutableRefObject<null>
  draggable?: boolean;
  assignedZIndex?: number;
  onClick?: () => void;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardRef: RefObject<HTMLDivElement>) => void;
}

export function PlayingCard({
  className,
  suit,
  rank,
  isShowing,
  cardPosition,
  boardRef,
  draggable = false,
  assignedZIndex,
  onClick,
  onDragEnd,
}: PlayingCardProps) {
  "use client"
  const [wasDragged, setWasDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleDragStart = () => {
    setWasDragged(true)
  }

  return (
    <motion.div
      className={clsx(className, `absolute z-[${assignedZIndex}]`)}
      drag={draggable}
      dragConstraints={boardRef}
      dragElastic={1}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={(event, info) => onDragEnd?.(event, info, cardRef)}
      onClick={() => wasDragged ? null : onClick?.()}
      ref={cardRef}
    >
      <div
        className="group relative flex flex-col items-start select-none"
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
    </motion.div>
  )
}