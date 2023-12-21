import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { Stock } from './Stock';
import { Waste } from './Waste';
import { NertStack } from './NertStack';
import { CardSource } from '@/constants/nerts';

export function Stream({
    stream,
    waste,
    maxWasteShowing,
    nertStack,
    playCard,
    endGame,
    wasteCards,
    onDragEnd,
}: {
    stream: Card[];
    waste: Card[];
    maxWasteShowing: { current: number };
    nertStack: Card[];
    playCard: (props: PlayCardProps) => void;
    endGame: () => void;
    wasteCards: () => void;
    onDragEnd: (props: DropCardProps) => void;
}) {

    const handleDragEnd = (props: DropCardProps) => {
        onDragEnd?.(props)
    }

    return (
        <div id="stream-and-waste" className="flex justify-center ">
            {/* waste */}
            <Waste waste={waste} playCard={playCard} maxWasteShowing={maxWasteShowing} onDragEnd={onDragEnd} />
            {/* stream */}
            <Stock stream={stream} wasteCards={wasteCards} />
            {/* nertStack for small screens */}
            <NertStack className="md:hidden" nertStack={nertStack} playCard={playCard} endGame={endGame} onDragEnd={({ card, cardRef }) => handleDragEnd({ card, cardRef, source: CardSource.Nert })} />
        </div>

    )
}