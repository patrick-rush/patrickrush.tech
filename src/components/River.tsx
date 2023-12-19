import type { Card, PlayCardProps } from '@/types/nerts.d'
import { Column } from './Column';
import { useState, type MutableRefObject, type RefObject, useRef } from 'react';
import { LayoutGroup } from 'framer-motion'
import { motion } from "framer-motion"

export function River({
    river,
    playCard,
    boardRef,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    boardRef: MutableRefObject<null>;
    onDragEnd: (card: Card, cardRef: RefObject<HTMLDivElement>, originator: string, foundationIndex?: number | null) => void;
}) {
    const [wasDragged, setWasDragged] = useState(false)
    
    const handleDragStart = () => {
        console.log("drag started")
        setWasDragged(true)
    }
    
    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>, riverIndex: number, foundationIndex?: number | null) => {
        onDragEnd?.(card, cardRef, `river-${riverIndex}`, foundationIndex)
        setWasDragged(false)
    }

    return (
        <>
            {river.map((pile, riverIndex) => (
                <div key={riverIndex} style={{ /*...styles*/ }}>
                    <div id={`river-${riverIndex}`} className="relative w-16 h-24 md:w-24 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                        <Column
                            pile={pile}
                            riverIndex={riverIndex}
                            parentIndex={0}
                            playCard={playCard}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            wasDragged={wasDragged}
                            river={river}
                        />
                    </div>
                </div>
            ))}
        </>
    )
}