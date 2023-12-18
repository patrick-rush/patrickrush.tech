import type { Card, PlayCardProps } from '@/types/nerts.d'
import { River } from './River';
import { NertStack } from './NertStack';
import type { MutableRefObject, RefObject } from 'react';
import type { PanInfo } from "framer-motion"

export function Tableau({
    river,
    nertStack,
    boardRef,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    nertStack: Card[];
    boardRef: MutableRefObject<null>;
    onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardRef: RefObject<HTMLDivElement>, originator: string) => void;
}) {

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardRef: RefObject<HTMLDivElement>, originator: string) => {
        onDragEnd?.(event, info, cardRef, originator)
    }

    return (
        <div id="tableau" className="grid grid-cols-4 justify-items-center md:flex justify-between pb-16">
            {/* river */}
            <River river={river} playCard={playCard} boardRef={boardRef} onDragEnd={(event, info, cardRef) => handleDragEnd(event, info, cardRef, "river")} />
            {/* nert stack */}
            <NertStack nertStack={nertStack} playCard={playCard} boardRef={boardRef} onDragEnd={(event, info, cardRef) => handleDragEnd(event, info, cardRef, "nert")} />
        </div>
    )
}