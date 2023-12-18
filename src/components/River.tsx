import type { Card, PlayCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';
import type { MutableRefObject, RefObject } from 'react';
// import { LayoutGroup } from 'framer-motion'

export function River({
    river,
    playCard,
    boardRef,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    boardRef: MutableRefObject<null>;
    onDragEnd: (card: Card, cardRef: RefObject<HTMLDivElement>, originator: string) => void;
}) {

    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>, index: number) => {
        onDragEnd?.(card, cardRef, `river-${index}`)
    }

    return (
        <>
            {river.map((_, riverIndex) => (
                <div key={riverIndex} >
                    <div style={{ height: `${Math.max((192 + 40 * (Math.max(...river.map(pile => pile.length)) - 1), 312))}px` }}>
                        <div id={`river-${riverIndex}`} z-index="auto" className="relative w-16 h-24 md:w-24 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {river[riverIndex].map((card, cardIndex) => (
                                <div id={`river-${riverIndex}-${cardIndex}`} key={cardIndex} className="absolute" style={{ top: `${(Math.min(200 / river[riverIndex].length, 40)) * cardIndex}px` }} >
                                    <PlayingCard
                                        className="shadow-md shadow-zinc-800 rounded-md"
                                        assignedZIndex={cardIndex}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
                                        onDragEnd={(cardRef) => handleDragEnd(card, cardRef, riverIndex)}
                                        onClick={() => playCard({
                                            card,
                                            source: "river",
                                            pileIndex: riverIndex,
                                            foundationIndex: ((cardIndex < river[riverIndex].length - 1) ? cardIndex : null)
                                        })}
                                        boardRef={boardRef}
                                        draggable={cardIndex === river[riverIndex].length - 1}
                                    // cardPosition={riverPositions?.get(riverIndex)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </>

    )
}