export interface Suit {
    name: 'Hearts' | 'Clubs' | 'Diamonds' | 'Spades';
    symbol: '♥' | '♣' | '♦' | '♠';
    type: 0 | 1,
    color: 'red-800' | 'zinc-950';
}

export interface Rank {
    display: string,
    name: string,
    position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
}

export interface Card {
    suit: Suit;
    rank: Rank;
}

export interface CommonPlayCardProps {
    card: Card;
}
export type ConditionalPlayCardProps = | {
    source: 'river';
    pileIndex: number;
    foundationIndex?: number | null;
} | {
    source: 'waste' | 'nert';
    pileIndex?: never;
    foundationIndex?: never;
}

export type PlayCardProps = CommonPlayCardProps & ConditionalPlayCardProps

export interface DragProps {
    card: Card;
    cardRef: RefObject<HTMLDivElement>;
    originator: string;
    foundationIndex?: number;
}