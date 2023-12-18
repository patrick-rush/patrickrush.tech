import type { Suit, Rank} from '@/types/nerts'

export const suits: Suit[] = [
    {
        name: 'Hearts',
        symbol: '♥',
        type: 0,
        color: 'red-800'
    },
    {
        name: 'Clubs',
        symbol: '♣',
        type: 1,
        color: 'zinc-950'
    },
    {
        name: 'Diamonds',
        symbol: '♦',
        type: 0,
        color: 'red-800'
    },
    {
        name: 'Spades',
        symbol: '♠',
        type: 1,
        color: 'zinc-950'
    },
]

export const ranks: Rank[] = [
    {
        display: "A",
        name: "Ace",
        position: 1
    },
    {
        display: "2",
        name: "Two",
        position: 2
    },
    {
        display: "3",
        name: "Three",
        position: 3
    },
    {
        display: "4",
        name: "Four",
        position: 4
    },
    {
        display: "5",
        name: "Five",
        position: 5
    },
    {
        display: "6",
        name: "Six",
        position: 6
    },
    {
        display: "7",
        name: "Seven",
        position: 7
    },
    {
        display: "8",
        name: "Eight",
        position: 8
    },
    {
        display: "9",
        name: "Nine",
        position: 9
    },
    {
        display: "10",
        name: "Ten",
        position: 10
    },
    {
        display: "J",
        name: "Jack",
        position: 11
    },
    {
        display: "Q",
        name: "Queen",
        position: 12
    },
    {
        display: "K",
        name: "King",
        position: 13
    },
]
