import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';
import type { MutableRefObject, RefObject } from 'react';

export function Waste({
    waste,
    maxWasteShowing,
    playCard,
    boardRef,
    onDragEnd,
}: {
    waste: Card[];
    maxWasteShowing: { current: number }
    playCard: (props: PlayCardProps) => void;
    boardRef: MutableRefObject<null>;
    onDragEnd: (props: DragProps) => void;
}) {

    const calculateOffset = (index: number) => {
        const refIndex = maxWasteShowing.current - 1
        if (waste.length < 3) {
            return index * 40
        }
        return index === refIndex ? 80 : (index + 1 === refIndex ? 40 : 0)
    }

    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>) => {
        onDragEnd?.({card, cardRef, originator: 'waste'})
    }

    return (
        <div className="mx-8">
            <div
                className="z-0 relative w-36 h-24 md:w-44 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40"
                id="waste" 
            >
                {waste.map((card, index) => {
                    let offset = 0
                    offset = calculateOffset(index)
                    let shadow = ''
                    if (index > maxWasteShowing.current - 4 || index === waste.length - 1) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                    return (
                        <div id={`waste-${index}`} key={index} className="absolute" style={{ left: `${offset}px` }}>
                            <PlayingCard
                                className={shadow}
                                assignedZIndex={index}
                                suit={card.suit}
                                rank={card.rank}
                                isShowing={true}
                                boardRef={boardRef}
                                draggable={index === waste.length - 1}
                                onDragEnd={(cardRef) => handleDragEnd(card, cardRef)}
                                onClick={() => playCard({ card: waste[waste.length - 1], source: 'waste' })}
                            // cardPosition={wastePosition}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}