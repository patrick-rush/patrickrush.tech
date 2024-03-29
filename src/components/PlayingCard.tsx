"use client"
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import React, { ForwardRefRenderFunction, RefObject, forwardRef, useRef, useState } from 'react'
import type { RankDetails, Suit } from '@/types/solitaire'
import { motion } from "framer-motion"

type PlayingCardProps = {
  className?: string
  id?: string;
  suit: Suit;
  rank: RankDetails;
  isShowing: boolean;
  draggable?: boolean;
  style?: any;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (cardRef: RefObject<HTMLDivElement>) => void;
}

const PlayingCardComponent: ForwardRefRenderFunction<HTMLDivElement, PlayingCardProps> = (props, ref) => {
  "use client"
  const {
    className,
    id,
    suit,
    rank,
    isShowing,
    draggable = false,
    style,
    onClick,
    onDragStart,
    onDragEnd,
  } = props
  const [wasDragged, setWasDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleDragStart = () => {
    onDragStart?.()
    setWasDragged(true)
  }

  const handleDragEnd = () => {
    onDragEnd?.(cardRef)
    setWasDragged(false)
  }

  return (
    <motion.div
      className={clsx(className, `absolute`)}
      id={id}
      drag={draggable}
      style={style}
      dragElastic={1}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      transition={{
        ease: "easeInOut",
        duration: 1,
      }}
      onClick={() => wasDragged ? null : onClick?.()}
      ref={ref || cardRef}
    >
      <div
        className="group relative flex flex-col items-start select-none"
      >
        <div hidden className="border-0 text-zinc-950 text-red-800"></div>
        {/* {children} */}
        {isShowing ?
          <div className="w-11 h-[4.175rem] md:w-16 md:h-24 lg:w-24 lg:h-36 bg-white rounded-md flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className={`text-${suit.type}`}>
                <p className="text-lg font-bold">{rank.display}</p>
              </div>
              <div className={`text-${suit.type}`}>
                <p className="text-lg font-thin">{suit.symbol}</p>
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className={`absolute text-${suit.type} font-thin ${suit.name === 'Spades' && rank.position === 1 ? 'text-5xl md:text-[5rem] leading-[1rem] lg:text-8xl' : 'text-5xl'}`}>{suit.symbol}</div>
            </div>
            <div className="hidden lg:flex justify-between">
              <div className={`text-${suit.type} rotate-180`}>
                <p className="text-lg font-thin">{suit.symbol}</p>
              </div>
              <div className={`text-${suit.type} rotate-180`}>
                <p className="text-lg font-bold">{rank.display}</p>
              </div>
            </div>
          </div>
          :
          <div className="w-11 h-[4.175rem] md:w-16 md:h-24 lg:w-24 lg:h-36 absolute rounded-md">
            <Image draggable="false" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={cardBack} className={clsx(className, "rounded-md")} alt="reverse of playing card" />
          </div>
        }
      </div>
    </motion.div>
  )
}

export const PlayingCard = forwardRef<HTMLDivElement, PlayingCardProps>(PlayingCardComponent)
