import type { Card, PlayCardProps } from '@/types/nerts.d'
import { Stream } from './Stream';
import { Waste } from './Waste';

export function WasteAndStream({
    stream,
    waste,
    maxWasteShowing,
    playCard,
    wasteCards,
}: {
    stream: Card[];
    waste: Card[];
    maxWasteShowing: { current: number }
    playCard: (props: PlayCardProps) => void;
    wasteCards: () => void;
}) {
    return (
        <div id="stream-and-waste" className="flex justify-center ">
            {/* stream */}
            <Stream stream={stream} wasteCards={wasteCards} />
            {/* waste */}
            <Waste waste={waste} playCard={playCard} maxWasteShowing={maxWasteShowing} />
        </div>

    )
}