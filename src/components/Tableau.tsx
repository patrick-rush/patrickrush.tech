import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { River } from './River';
import { NertStack } from './NertStack';

export function Tableau({
    river,
    nertStack,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    nertStack: Card[];
    onDragEnd: (props: DropCardProps) => void;
}) {

    const handleDragEnd = (props: DropCardProps) => {
        onDragEnd?.(props)
    }

    return (
        <div id="tableau" className="grid grid-cols-4 justify-items-center md:flex justify-between pb-52 md:pb-32">
            {/* river */}
            <River river={river} playCard={playCard} onDragEnd={handleDragEnd} />
            {/* nert stack */}
            <NertStack className="hidden md:flex" nertStack={nertStack} playCard={playCard} onDragEnd={({card, cardRef}) => handleDragEnd({ card, cardRef, source: "nert" })} />
        </div>
    )
}