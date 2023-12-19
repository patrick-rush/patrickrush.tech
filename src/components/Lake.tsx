import { PlayingCard } from "./PlayingCard";
import type { Card } from '@/types/nerts.d'

export function Lake({
    numberOfPlayers,
    lake,
}: {
    numberOfPlayers: number;
    lake: Card[][];
}) {
    return (
        <div id="lake" className="pb-8">
            <div className="grid grid-cols-8 place-items-center px-8 md:px-0 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: (numberOfPlayers * 4) }).map((_, index) => {
                    const pile = lake[index]
                    return (
                        <div id={`lake-${index}`} key={index} className="w-16 h-24 md:w-24 md:h-36 my-4">
                            {pile?.map((card, cardIndex) => {
                                const pileLength = pile.length
                                let shadow = ''
                                if (index > pileLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                                return (
                                    <PlayingCard
                                        className={shadow}
                                        key={cardIndex}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
                                    // cardPosition={lakePositions?.get(index)}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}