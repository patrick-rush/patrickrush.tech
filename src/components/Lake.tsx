import { PlayingCard } from "./PlayingCard";
import type { Card } from '@/types/solitaire'
import clsx from "clsx";

export function Lake({
    lake,
}: {
    lake: Card[][];
}) {

    return (
        <div id="lake" className="pb-8">
            <div className="grid grid-cols-4 place-items-center px-8 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: 4 }).map((_, index) => {
                    const pile = lake[index]
                    let shadow = ''
                    if (pile.length) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                    return (
                        <div className={clsx(shadow, "relative w-16 h-24 md:w-24 md:h-36 my-4")} key={index} id={`lake-${index}`}>
                            {pile?.map((card, cardIndex) => {
                                const pileLength = pile.length
                                let shadow = ''
                                if (index > pileLength - 3) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                                return (
                                    <PlayingCard
                                        className={shadow}
                                        key={cardIndex}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
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