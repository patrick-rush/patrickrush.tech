import type { Card, PlayCardProps, DropCardProps } from '@/types/solitaire'
import { PlayingCard } from './PlayingCard'
import { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { CardSource } from '@/constants/solitaire'
interface ColumnProps {
    pile: Card[]
    riverIndex: number
    parentIndex: number
    playCard: (props: PlayCardProps) => void
    handleDragStart: () => void
    handleDragEnd: (props: DropCardProps) => void
    wasDragged: boolean;
    river: Card[][];
    parentZIndex?: number;
    disabled: boolean;
}

export const Column = ({ pile,
    riverIndex,
    parentIndex,
    playCard,
    handleDragStart: onDragStart,
    handleDragEnd: onDragEnd,
    wasDragged,
    river,
    parentZIndex,
    disabled
}: ColumnProps): JSX.Element => {
    const [zIndex, setZIndex] = useState(parentZIndex || 0)
    const cardRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    if (parentIndex >= pile.length) {
        return <></>
    }

    const handleDragStart = () => {
        setZIndex(zIndex + 1000)
        onDragStart()
    }

    const handleDragEnd = (props: DropCardProps) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            setZIndex(parentZIndex || 0)
        }, 1000)

        onDragEnd(props)
    }

    const card = pile[parentIndex]
    const id = parentIndex === pile.length - 1 ? `${CardSource.River}-${riverIndex}` : undefined

    return (
        <motion.div
            className="relative"
            style={{ zIndex: zIndex }}
            drag={card.flipped && !disabled}
            dragElastic={1}
            dragSnapToOrigin
            onDragStart={handleDragStart}
            onDragEnd={(event) => {
                event.stopPropagation()
                handleDragEnd({
                    card,
                    cardRef,
                    source: CardSource.River,
                    pileIndex: riverIndex,
                    foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined,
                })
            }}
            onClick={(event) => {
                if (!wasDragged && card.flipped) {
                    event.stopPropagation()
                    playCard({
                        card,
                        source: CardSource.River,
                        pileIndex: riverIndex,
                        foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined
                    })
                }
            }}
        >
            <div key={parentIndex} className="absolute" >
                <PlayingCard
                    className="shadow-md shadow-zinc-800 rounded-md"
                    id={id}
                    style={{ top: `${Math.min(280 / river[riverIndex].length, 30) * parentIndex}px` }}
                    suit={card.suit}
                    rank={card.rank}
                    isShowing={!!card.flipped}
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
                    parentZIndex={zIndex}
                    disabled={disabled}
                />
            </div>
        </motion.div>
    )
}