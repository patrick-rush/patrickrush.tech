import type { Card, PlayCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';

export function River({
    river,
    playCard,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
}) {
    return (
        <>
            {river.map((_, riverIndex) => (
                <div key={riverIndex} id={`river-${riverIndex + 1}`}>
                    <div className="" style={{ height: `${Math.max((192 + 40 * (Math.max(...river.map(pile => pile.length)) - 1), 312))}px` }}>
                        <div className="relative w-16 h-24 md:w-24 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                            {river[riverIndex].map((card, cardIndex) => (
                                <div key={cardIndex} className="absolute" style={{ top: `${(Math.min(200 / river[riverIndex].length, 40)) * cardIndex}px` }} >
                                    <PlayingCard
                                        className={`z-[${cardIndex}] shadow-md shadow-zinc-800 rounded-md`}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
                                        onClick={() => playCard({
                                            card,
                                            source: "river",
                                            pileIndex: riverIndex,
                                            foundationIndex: ((cardIndex < river[riverIndex].length - 1) ? cardIndex : null)
                                        })}
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