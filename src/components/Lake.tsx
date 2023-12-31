import { CardSource } from "@/constants/solitaire";
import { PlayingCard } from "./PlayingCard";
import type { Card, DropCardProps, PlayCardProps } from '@/types/solitaire'
import clsx from "clsx";
import { RefObject, useEffect, useRef, useState } from "react";

export function Lake({
    lake,
    playCard,
    onDragEnd,
}: {
    lake: Card[][];
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (props: DropCardProps) => void;
}) {
    const [zIndex, setZIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleDragStart = () => {
        setZIndex(1000)
    }

    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>, pileIndex: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            setZIndex(0)
        }, 1000)

        onDragEnd?.({ card, cardRef, source: CardSource.Lake, pileIndex })
    }

    return (
        <div id="lake" className="pb-8">
            <div className="grid grid-cols-4 place-items-center px-8 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: 4 }).map((_, index) => {
                    const pile = lake[index]
                    // let shadow = ''
                    // if (pile.length) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                    return (
                        <div className={clsx("relative w-12 h-[4.5rem] md:w-16 md:h-24 lg:w-24 lg:h-36 my-4")} key={index} id={`lake-${index}`} style={{ zIndex: zIndex }}>
                            {pile?.map((card, cardIndex) => {
                                const pileLength = pile.length
                                let shadow = ''
                                if (index > pileLength - 3) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                                return (
                                    <PlayingCard
                                        className={shadow}
                                        key={cardIndex}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
                                        draggable={cardIndex === pile.length - 1}
                                        onDragStart={handleDragStart}
                                        onDragEnd={(cardRef) => handleDragEnd(card, cardRef, index)}
                                        onClick={() => playCard({
                                            card: pile[pile.length - 1], 
                                            source: CardSource.Lake,
                                            pileIndex: index,
                                        })}    
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}