import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { Stream } from './Stream';
import { Waste } from './Waste';
import type { MutableRefObject, RefObject } from 'react';
import { NertStack } from './NertStack';

export function WasteAndStream({
    stream,
    waste,
    maxWasteShowing,
    nertStack,
    playCard,
    wasteCards,
    onDragEnd,
}: {
    stream: Card[];
    waste: Card[];
    maxWasteShowing: { current: number };
    nertStack: Card[];
    playCard: (props: PlayCardProps) => void;
    wasteCards: () => void;
    onDragEnd: (props: DragProps) => void;
}) {

    const handleDragEnd = (props: DragProps) => {
        onDragEnd?.(props)
    }

    return (
        <div id="stream-and-waste" className="flex justify-center ">
            {/* waste */}
            <Waste waste={waste} playCard={playCard} maxWasteShowing={maxWasteShowing} onDragEnd={onDragEnd} />
            {/* stream */}
            <Stream stream={stream} wasteCards={wasteCards} />
            {/* nertStack for small screens */}
            <NertStack className="md:hidden" nertStack={nertStack} playCard={playCard} onDragEnd={({card, cardRef}) => handleDragEnd({ card, cardRef, originator: "nert"})} />
        </div>

    )
}