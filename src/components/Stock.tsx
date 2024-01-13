import type { Card } from '@/types/solitaire'
import { PlayingCard } from './PlayingCard';

export function Stock({
    stream,
    wasteCards,
}: {
    stream: Card[];
    wasteCards: () => void;
}) {
    return (
        <div id="stream" className="mx-8">
            <div className="w-11 h-[4.175rem] md:w-16 md:h-24 lg:w-24 lg:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40 z-0" onClick={wasteCards}>
                <div className="absolute w-11 h-[4.175rem] md:w-16 md:h-24 lg:w-24 lg:h-36 text-zinc-400 dark:text-zinc-500 flex justify-center items-center select-none">
                    <span className="text-l md:text-2xl font-bold">FLIP</span>
                </div>
                {stream.map((card, index) => {
                    const streamLength = stream.length
                    let shadow = ''
                    if (index > streamLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                    return (
                        <PlayingCard
                            className={shadow}
                            key={index}
                            suit={card.suit}
                            rank={card.rank}
                            isShowing={false}
                        />
                    )
                })}
            </div>
        </div>

    )
}