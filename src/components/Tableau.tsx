import type { Card, PlayCardProps, DropCardProps } from '@/types/solitaire'
import { River } from './River'

export function Tableau({
    river,
    disabled,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    disabled: boolean;
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (props: DropCardProps) => void;
}) {

    const handleDragEnd = (props: DropCardProps) => {
        onDragEnd?.(props)
    }

    return (
        <div id="tableau" className="grid grid-cols-7 justify-items-center md:flex justify-between pb-72">
            {/* river */}
            <River river={river} playCard={playCard} onDragEnd={handleDragEnd} disabled={disabled} />
        </div>
    )
}