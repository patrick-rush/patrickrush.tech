import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { River } from './River';
import { NertStack } from './NertStack';
import type { MutableRefObject, RefObject } from 'react';

export function Tableau({
    river,
    nertStack,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    nertStack: Card[];
    onDragEnd: (props: DragProps) => void;
}) {

    const handleDragEnd = (props: DragProps) => {
        onDragEnd?.(props)
    }

    return (
        <div id="tableau" className="grid grid-cols-4 justify-items-center md:flex justify-between pb-16">
            {/* river */}
            <River river={river} playCard={playCard} onDragEnd={handleDragEnd} />
            {/* nert stack */}
            <NertStack nertStack={nertStack} playCard={playCard} onDragEnd={({card, cardRef}) => handleDragEnd({ card, cardRef, originator: "nert"})} />
        </div>
    )
}