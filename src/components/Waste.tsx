import type { Card, PlayCardProps, DropCardProps } from '@/types/solitaire'
import { PlayingCard } from './PlayingCard';
import { useState, type RefObject, useRef, useEffect } from 'react';
import { CardSource } from '@/constants/solitaire';

export function Waste({
    waste,
    maxWasteShowing,
    disabled,
    playCard,
    onDragEnd,
}: {
    waste: Card[];
    maxWasteShowing: { current: number };
    disabled: boolean;
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

    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            setZIndex(0)
        }, 1000)

        onDragEnd?.({ card, cardRef, source: CardSource.Waste })
    }

    const calculateOffset = (index: number) => {
        const refIndex = maxWasteShowing.current - 1
        if (waste.length < 3) {
            return index * 40
        }
        return index === refIndex ? 80 : (index + 1 === refIndex ? 40 : 0)
    }

    return (
        <div id={CardSource.Waste} className="md:mx-8">
            <div className="w-[7.75rem] h-[4.175rem] md:w-36 md:h-24 lg:w-44 lg:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40" style={{ zIndex: zIndex }}>
                <div className="absolute">
                    {waste.map((card, index) => {
                        let offset = 0
                        offset = calculateOffset(index)
                        let shadow = ''
                        if (index > maxWasteShowing.current - 4 || index === waste.length - 1 || waste.length <= 3) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                        return (
                            <div id={`${CardSource.Waste}-${index}`} key={index} className="absolute" style={{ left: `${offset}px`, zIndex: zIndex }}>
                                <PlayingCard
                                    className={shadow}
                                    suit={card.suit}
                                    rank={card.rank}
                                    isShowing={true}
                                    draggable={index === waste.length - 1 && !disabled}
                                    onDragStart={handleDragStart}
                                    onDragEnd={(cardRef) => handleDragEnd(card, cardRef)}
                                    onClick={() => playCard({ card: waste[waste.length - 1], source: CardSource.Waste })}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}