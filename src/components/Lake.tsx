import { AnimatePresence, motion } from "framer-motion";
import { PlayingCard } from "./PlayingCard";
import type { Card } from '@/types/nerts.d'
import { useEffect, useRef } from "react";

interface Player {
    displayName: string;
    id: string;
}

export function Lake({
    numberOfPlayers,
    lake,
    lastInLake,
}: {
    numberOfPlayers: number;
    lake: Card[][];
    lastInLake: { player: Player, card: Card } | null;
}) {
    return (
        <div id="lake" className="pb-8">
            <div className="grid grid-cols-8 place-items-center px-8 md:px-0 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                {Array.from({ length: (numberOfPlayers * 4) }).map((_, index) => {
                    const pile = lake[index]
                    let showPlayerName
                    if (lastInLake && lastInLake.player && lastInLake.card && pile.includes(lastInLake?.card)) showPlayerName = true
                    return (
                        <div className="relative w-16 h-24 md:w-24 md:h-36 my-4" key={index} id={`lake-${index}`}>
                            <AnimatePresence>
                                {showPlayerName && <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0, 0.71, 0.2, 1.01]
                                    }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -top-20 w-full flex justify-center"
                                >
                                    <span className="text-sm text-center font-semibold text-teal-500 dark:text-teal-400">{lastInLake?.player.displayName} +{lastInLake?.card.rank.position === 13 ? '3' : '1'}</span>
                                </motion.div>}
                            </AnimatePresence>
                            {pile?.map((card, cardIndex) => {
                                const pileLength = pile.length
                                let shadow = ''
                                if (index > pileLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                                return (
                                    <PlayingCard
                                        className={shadow}
                                        key={cardIndex}
                                        suit={card.suit}
                                        rank={card.rank}
                                        isShowing={true}
                                    // cardPosition={lakePositions?.get(index)}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}