import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard'
import { useRef } from 'react'
import { motion } from "framer-motion"
interface ColumnProps {
    pile: Card[]
    riverIndex: number
    parentIndex: number
    playCard: (props: PlayCardProps) => void
    handleDragStart: () => void
    handleDragEnd: (props: DragProps) => void
    wasDragged: boolean;
    river: Card[][];
}

export const Column = ({ pile, riverIndex, parentIndex, playCard, handleDragStart, handleDragEnd, wasDragged, river }: ColumnProps): JSX.Element => {
    const cardRef = useRef<HTMLDivElement>(null)
    if (parentIndex >= pile.length) {
        return <></>
    }
    const card = pile[parentIndex]
    return (
        <motion.div
            drag
            dragElastic={1}
            dragSnapToOrigin
            onDragStart={handleDragStart}
            onDragEnd={() => handleDragEnd({
                card,
                cardRef,
                originator: `river-${riverIndex}`,
                foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined,
            })}
            onClick={() => wasDragged ? null : playCard({
                card,
                source: "river",
                pileIndex: riverIndex,
                foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined
            })}
        >     
            <div id={`river-${riverIndex}-${parentIndex}`} key={parentIndex} className="absolute" >
                <PlayingCard
                    className="shadow-md shadow-zinc-800 rounded-md"
                    style={{ top: `${Math.min(200 / river[riverIndex].length, 40) * parentIndex}px` }}
                    assignedZIndex={parentIndex}
                    suit={card.suit}
                    rank={card.rank}
                    isShowing={true}
                    ref={cardRef}
                />
                <Column
                    pile={pile}
                    riverIndex={riverIndex}
                    parentIndex={parentIndex + 1}
                    playCard={playCard}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    wasDragged={wasDragged}
                    river={river}
                />
            </div>
        </motion.div>
    )
}