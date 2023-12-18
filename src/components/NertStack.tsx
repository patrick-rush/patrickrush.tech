import type { Card, PlayCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';

export function NertStack({
    nertStack,
    playCard,
}: {
    nertStack: Card[];
    playCard: (props: PlayCardProps) => void;
}) {
    return (
        <>
            <div id="nert" className="col-span-4 md:flex">
                <div className="md:ml-16">
                    <div
                        className="block w-16 h-24 md:w-24 md:h-36 outline outline-teal-500 dark:outline-teal-400 outline-offset-4 rounded-md"
                        onClick={() => playCard({
                            card: nertStack[nertStack.length - 1],
                            source: "nert"
                        })
                        }>
                        <div className="absolute w-16 h-24 md:w-24 md:h-36 text-teal-500 dark:text-teal-400 flex justify-center items-center select-none">
                            <span className="text-l md:text-2xl font-bold">NERTS</span>
                        </div>
                        {nertStack.map((card, index) => {
                            const nertLength = nertStack.length
                            let shadow = ''
                            if (index > nertLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                            return (
                                <PlayingCard
                                    className={`z-[${index}] ${shadow}`}
                                    key={index}
                                    suit={card.suit}
                                    rank={card.rank}
                                    isShowing={true}
                                // cardPosition={nertStackPosition}
                                />
                            )
                        })}
                    </div>
                    <div className="grid justify-items-center m-4 font-medium text-lg text-zinc-400 dark:text-zinc-500">
                        {nertStack.length}
                    </div>
                </div>
            </div>
        </>
    )
}