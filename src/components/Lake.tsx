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
        <div id="lake" className="py-8 px-2">
            <div className="grid grid-cols-4 place-items-center sm:px-8 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: 4 }).map((_, index) => {
                    const pile = lake[index]
                    const card = pile.length ? pile[pile.length - 1] : null
                    return (
                        <div className={clsx("relative w-11 h-[4.175rem] md:w-16 md:h-24 lg:w-24 lg:h-36 my-4")} key={index} style={{ zIndex: zIndex }}>
                                {card && <PlayingCard
                                    className="shadow-md shadow-zinc-800 rounded-md"
                                    id={`lake-${index}-top`} 
                                    suit={card.suit}
                                    rank={card.rank}
                                    isShowing
                                    draggable
                                    onDragStart={handleDragStart}
                                    onDragEnd={(cardRef) => handleDragEnd(card, cardRef, index)}
                                    onClick={() => playCard({
                                        card: pile[pile.length - 1], 
                                        source: CardSource.Lake,
                                        pileIndex: index,
                                    })}    
                                />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}