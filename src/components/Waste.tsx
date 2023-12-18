import type { Card, PlayCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';

export function Waste({
    waste,
    maxWasteShowing,
    playCard,
}: {
    waste: Card[];
    maxWasteShowing: { current: number }
    playCard: (props: PlayCardProps) => void;
}) {

    const calculateOffset = (index: number) => {
        const refIndex = maxWasteShowing.current - 1
        if (waste.length < 3) {
            return index * 40
        }
        return index === refIndex ? 80 : (index + 1 === refIndex ? 40 : 0)
    }

    return (
        <div id="waste" className="mx-8">
            <div
                className="relative w-36 h-24 md:w-44 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40"
                onClick={() => playCard({ card: waste[waste.length - 1], source: 'waste' })}
            >
                {waste.map((card, index) => {
                    let offset = 0
                    offset = calculateOffset(index)
                    let shadow = ''
                    if (index > maxWasteShowing.current - 4 || index === waste.length - 1) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                    return (
                        <div key={index} className="absolute" style={{ left: `${offset}px` }}>
                            <PlayingCard
                                className={`z-[${index}] ${shadow}`}
                                suit={card.suit}
                                rank={card.rank}
                                isShowing={true}
                            // cardPosition={wastePosition}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}