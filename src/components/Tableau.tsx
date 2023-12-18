import type { Card, PlayCardProps } from '@/types/nerts.d'
import { River } from './River';
import { NertStack } from './NertStack';

export function Tableau({
    river,
    playCard,
    nertStack,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    nertStack: Card[];
}) {
    return (
        <div id="tableau" className="grid grid-cols-4 justify-items-center md:flex justify-between pb-16">
            {/* river */}
            <River river={river} playCard={playCard} />
            {/* nert stack */}
            <NertStack nertStack={nertStack} playCard={playCard} />
        </div>
    )
}