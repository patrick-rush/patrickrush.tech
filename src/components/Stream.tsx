import type { Card, PlayCardProps, DropCardProps } from '@/types/solitaire'
import { Stock } from './Stock';
import { Waste } from './Waste';

export function Stream({
    stream,
    waste,
    maxWasteShowing,
    disabled,
    playCard,
    wasteCards,
    onDragEnd,
}: {
    stream: Card[];
    waste: Card[];
    maxWasteShowing: { current: number };
    disabled: boolean;
    playCard: (props: PlayCardProps) => void;
    wasteCards: () => void;
    onDragEnd: (props: DropCardProps) => void;
}) {

    return (
        <div id="stream" className="flex justify-center ">
            {/* waste */}
            <Waste waste={waste} playCard={playCard} maxWasteShowing={maxWasteShowing} onDragEnd={onDragEnd} disabled={disabled} />
            {/* stream */}
            <Stock stream={stream} wasteCards={wasteCards} disabled={disabled} />
        </div>

    )
}