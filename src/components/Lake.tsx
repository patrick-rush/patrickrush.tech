import { CardSource } from "@/constants/solitaire";
import { PlayingCard } from "./PlayingCard";
import type { Card, DropCardProps, PlayCardProps } from '@/types/solitaire'
import clsx from "clsx";
import { RefObject, useEffect, useRef, useState } from "react";

export function Lake({
    lake,
    gameOver,
    playCard,
    onDragEnd,
}: {
    lake: Card[][];
    gameOver: boolean;
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (props: DropCardProps) => void;
}) {
    return (
        <div id="lake" className="py-8 px-2">
            <div className="grid grid-cols-4 place-items-center sm:px-8 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: 4 }).map((_, index) => {
                    const pile = lake[index]
                    return (
                        <div className={clsx("relative w-12 h-[4.5rem] md:w-16 md:h-24 lg:w-24 lg:h-36 my-4")} key={index} id={`lake-${index}`}>
                            {pile?.map((card, cardIndex) => (
                                <Pile 
                                    gameOver={gameOver}
                                    key={cardIndex}
                                    pile={pile}
                                    pileIndex={index}
                                    card={card}
                                    cardIndex={cardIndex}
                                    playCard={playCard}
                                    onDragEnd={(cardRef) => onDragEnd?.({ card, cardRef, source: CardSource.Lake, pileIndex: index })}
                                />
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Pile({
    gameOver,
    pile,
    pileIndex,
    card,
    cardIndex,
    playCard,
    onDragEnd,
}: {
    gameOver: boolean;
    pile: Card[];
    pileIndex: number;
    card: Card;
    cardIndex: number;
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (cardRef: RefObject<HTMLDivElement>) => void;
}) {
    const [zIndex, setZIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleDragStart = () => {
        setZIndex(zIndex + 1000)
    }

    const handleDragEnd = (cardRef: RefObject<HTMLDivElement>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            setZIndex(0)
        }, 1000)

        onDragEnd?.(cardRef)
    }

    const pileLength = pile.length
    let shadow = ''
    if (cardIndex > pileLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'

    return (
        <div style={{ position: "absolute", zIndex: zIndex }}>

            <PlayingCard
                className={shadow}
                suit={card.suit}
                rank={card.rank}
                isShowing={true}
                draggable={!gameOver && cardIndex === pile.length - 1}
                onDragStart={handleDragStart}
                onDragEnd={(cardRef) => handleDragEnd(cardRef)}
                onClick={() => playCard({
                    card: pile[pile.length - 1],
                    source: CardSource.Lake,
                    pileIndex: pileIndex,
                })}
            />
        </div>
    )
}