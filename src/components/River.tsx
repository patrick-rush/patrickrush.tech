import type { Card, PlayCardProps, DropCardProps } from '@/types/solitaire'
import { Column } from './Column';
import { useState } from 'react';

export function River({
    river,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (props: DropCardProps) => void;
}) {
    const [wasDragged, setWasDragged] = useState(false)
    
    const handleDragStart = () => {
        console.log("drag started")
        setWasDragged(true)
    }
    
    const handleDragEnd = (props: DropCardProps) => {
        onDragEnd?.(props)
        setWasDragged(false)
    }

    return (
        <>
            {river.map((pile, riverIndex) => (
                    <div key={riverIndex} id={`river-${riverIndex}`} className="relative w-12 h-[4.5rem] md:w-16 md:h-24 lg:w-24 lg:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                <div >
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