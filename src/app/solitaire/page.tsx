'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks, CardSource } from '@/constants/solitaire'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { Stream } from '@/components/Stream'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import { motion } from 'framer-motion'
import JSConfetti from 'js-confetti'
import type {
  Card,
  PlayCardProps,
  DropCardProps,
  HandleUpdateRiverProps,
  GetSourceArrayProps,
} from '@/types/solitaire'

function RefreshIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
      />
    </svg>
  )
}

function InfoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  )
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}

export default function Solitaire() {
  'use client'
  const [river, setRiver] = useState<Card[][]>(
    Array.from({ length: 7 }, () => []),
  )
  const [stream, setStream] = useState<Card[]>([])
  const [waste, setWaste] = useState<Card[]>([])
  const [lake, setLake] = useState<Card[][]>(
    Array.from({ length: 4 }, () => []),
  )
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState(false)
  const maxWasteShowing = useRef(0)

  // for testing
  // const [rect, setRect] = useState<DOMRect | null>(null)

  const deck = useMemo(
    () =>
      suits.flatMap((suit) => {
        return ranks.map((rank) => {
          return {
            suit,
            rank,
            flipped: true,
          }
        })
      }),
    [],
  )

  const shuffle = (array: any[]) => array.sort((a, b) => 0.5 - Math.random())

  // useEffect(() => {
  //     // for testing
  //     let existingElement = document.querySelector("#test-element")
  //     if (existingElement) document.body.removeChild(existingElement)
  //     let element = document.createElement("div")

  //     element.style.position = "absolute"
  //     element.style.zIndex = "10000"
  //     element.style.height = rect?.height + "px" || "0px"
  //     element.style.width = rect?.width + "px" || "0px"
  //     element.style.left = rect?.left + "px"|| "0px"
  //     element.style.right = rect?.right + "px"|| "0px"
  //     element.style.top = rect?.top + "px"|| "0px"
  //     element.style.bottom = rect?.bottom + "px"|| "0px"
  //     element.style.borderWidth = "4px"
  //     element.style.borderColor = "red"

  //     element.id = "test-element"

  //     document.body.appendChild(element)

  //     return () => {
  //         if (document.body.contains(element)) {
  //             document.body.removeChild(element)
  //         }
  //     }
  // }, [rect])

  useEffect(() => {
    let shuffledDeck: Card[] = shuffle(deck)
    setWaste([])
    setStream(shuffledDeck.splice(0, 24))
    let river: Card[][] = []
    for (let i = 0; i < 7; i++) {
      let pile: Card[] = []
      pile.push(
        ...shuffledDeck.splice(0, i).map((card: Card) => {
          card.flipped = false
          return card
        }),
      )
      if (shuffledDeck.length) pile.push(shuffledDeck.shift()!)
      river.push(pile)
    }
    setRiver(river)
    maxWasteShowing.current = 0
  }, [deck])

  useEffect(() => {
    const jsConfetti = new JSConfetti()
    if (lake.every((pile) => pile.length === 13)) {
      jsConfetti.addConfetti({
        emojis: ['♥️', '♣️', '♠️', '♦️'],
        confettiRadius: 3,
        confettiNumber: 100,
      })
      setGameOver(true)
    }
    return () => {
      jsConfetti.clearCanvas()
    }
  }, [lake])

  const wasteCards = useCallback(() => {
    if (gameOver) return

    const streamLength = stream.length
    let topOfStream

    if (stream.length >= 3)
      topOfStream = stream.splice(streamLength - 3).reverse()
    else topOfStream = stream.splice(0).reverse()

    if (topOfStream.length > 0) {
      const newWaste = [...waste, ...topOfStream]
      maxWasteShowing.current = newWaste.length
      setWaste(newWaste)
    } else {
      maxWasteShowing.current = 0
      setStream(waste.reverse())
      setWaste([])
    }
  }, [gameOver, stream, waste, maxWasteShowing, setWaste, setStream])

  const isCompatible = (
    boardArea: string,
    movingCard: Card,
    stationaryCard?: Card,
  ) => {
    switch (boardArea) {
      case CardSource.Lake:
        if (!stationaryCard) return movingCard.rank.position === 1
        const isOneMore =
          movingCard.rank.position - 1 === stationaryCard.rank.position
        const isSameSuit = movingCard.suit.name === stationaryCard.suit.name
        return isOneMore && isSameSuit
      case CardSource.River:
        if (!stationaryCard) return movingCard.rank.position === 13
        const isOneLess =
          movingCard.rank.position + 1 === stationaryCard.rank.position
        const isOppositeSuit = movingCard.suit.type !== stationaryCard.suit.type
        return isOneLess && isOppositeSuit
      default:
        throw new Error('Target is not a valid dropzone.')
    }
  }

  const getSourceArray = useCallback(
    (props: GetSourceArrayProps) => {
      const { source, pileIndex } = props
      switch (source) {
        case CardSource.Waste:
          return waste
        case CardSource.Lake:
          return lake[pileIndex!]
        case CardSource.River:
          return river[pileIndex!]
        default:
          throw new Error(`Invalid source: ${source}`)
      }
    },
    [river, lake, waste],
  )

  const handleUpdateRiver = ({
    destination,
    source,
    sourceIndex,
    start,
  }: HandleUpdateRiverProps) => {
    const copyOfRiver = [...river]
    if (start != null && sourceIndex != null) {
      copyOfRiver[destination].push(
        ...copyOfRiver[sourceIndex!].splice(
          start,
          copyOfRiver[sourceIndex!].length,
        ),
      )
    } else {
      const props: {
        source: CardSource.Waste | CardSource.Lake | CardSource.River
        pileIndex?: number
      } = { source }
      if (source === CardSource.River || source === CardSource.Lake)
        props.pileIndex = sourceIndex
      let sourceArray = getSourceArray(props as GetSourceArrayProps)
      const cardToMove = sourceArray.pop()
      if (cardToMove) copyOfRiver[destination].push(cardToMove)
    }
    if (sourceIndex && copyOfRiver[sourceIndex].length)
      copyOfRiver[sourceIndex][copyOfRiver[sourceIndex].length - 1].flipped =
        true
    setRiver(copyOfRiver)
    return true
  }

  const handleUpdateLake = ({
    destination,
    source,
    sourceIndex,
  }: {
    destination: number
    source: CardSource.Waste | CardSource.River | CardSource.Lake
    sourceIndex?: number
  }) => {
    let sourceArray
    if (source === CardSource.River || source === CardSource.Lake)
      sourceArray = getSourceArray({ source, pileIndex: sourceIndex! })
    else sourceArray = getSourceArray({ source })
    if (!sourceArray) return false
    const copyOfLake = [...lake]
    const cardToMove = sourceArray.pop()
    if (cardToMove) {
      copyOfLake[destination].push(cardToMove)
      if (source === CardSource.River && sourceArray.length)
        sourceArray[sourceArray.length - 1].flipped = true
    }
    setLake(copyOfLake)
    return true
  }

  // GAME OVER
  // const endGame = () => {
  //     setGameOver(true)
  //     window.alert("GAME OVER")
  // }

  const playCard = (props: PlayCardProps) => {
    if (gameOver) return

    const { card, source, pileIndex, foundationIndex } = props

    const tryToPlaceInLake = () => {
      return lake.some((pile, i) => {
        if (pile.length === 0) return false

        if (isCompatible(CardSource.Lake, card, pile[pile.length - 1]))
          return handleUpdateLake({
            destination: i,
            source,
            sourceIndex: pileIndex,
          })
        else return false
      })
    }

    const tryToPlaceInRiver = (start?: number) => {
      const placeCard = (index: number) => {
        if (source === CardSource.River)
          return handleUpdateRiver({
            destination: index,
            source,
            sourceIndex: pileIndex!,
            start,
          })
        else
          return handleUpdateRiver({
            destination: index,
            source,
            sourceIndex: pileIndex,
          })
      }

      const tryToPlaceOnPile = () => {
        return river.some((pile, i) => {
          if (isCompatible(CardSource.River, card, pile[pile.length - 1]))
            return placeCard(i)
          else return false
        })
      }

      return tryToPlaceOnPile()
    }

    let cardHandled = false

    /* handle aces */
    if (card?.rank.position === 1) {
      cardHandled = handleUpdateLake({
        destination: lake.findIndex((pile) => !pile.length),
        source,
        sourceIndex: pileIndex,
      })
      if (cardHandled) return true
    }

    /* try river */
    if (source === CardSource.River) {
      const isFoundationCard = foundationIndex != null
      const start = isFoundationCard
        ? foundationIndex
        : river[pileIndex!].length - 1

      if (!isFoundationCard) {
        cardHandled = tryToPlaceInLake()
        if (cardHandled) return true
      }

      cardHandled = tryToPlaceInRiver(start)
      if (cardHandled) return true

      /* try lake */
    } else {
      cardHandled = tryToPlaceInLake()
      if (cardHandled) return true
      cardHandled = tryToPlaceInRiver()
      if (cardHandled) return true
    }

    /* unable to place card */
    return false
  }

  const dropCard = ({
    card,
    cardRef,
    source,
    pileIndex,
    foundationIndex,
  }: DropCardProps) => {
    if (gameOver) return

    interface Target {
      pile: Card[]
      location: string
      index: number
    }

    const determineDestination = (ref: HTMLDivElement) => {
      if (!ref) {
        console.error('Card reference does not exist.')
        throw new Error(
          'cardRef has no current value or current value is incompatible',
        )
      }

      const { bottom, top, right, left, height } = ref.getBoundingClientRect()
      let target: Target | null = null
      const findTarget = (
        repetitions: number,
        piles: Card[][],
        location: string,
        source: CardSource,
        pileIndex?: number,
      ): Target | null => {
        for (let i = 0; i < repetitions; i++) {
          if (location === source && pileIndex === i) continue
          let domId: string = `${location}-${i}`
          const values = document.getElementById(domId)?.getBoundingClientRect()
          // for testing
          // if (values) setRect({
          //     ...values,
          //     right: right + 10,
          //     left: left - 10,
          //     bottom: bottom + 10,
          //     top: top - 10,
          // })
          // if (values) setRect(values)
          if (
            values &&
            left < values.right + 10 &&
            right > values.left - 10 &&
            top < values.bottom + 10 &&
            bottom > values.top - 10
          ) {
            return {
              pile: piles[i],
              location: location,
              index: i,
            }
          }
        }
        return null
      }

      target = findTarget(4, lake, CardSource.Lake, source, pileIndex)

      if (!target)
        target = findTarget(7, river, CardSource.River, source, pileIndex)

      return target
    }

    let destination
    try {
      if (cardRef?.current) destination = determineDestination(cardRef.current)
      if (!destination) return
    } catch (err) {
      console.info(err)
      return
    }

    let compatible
    try {
      const topCard = destination.pile[destination.pile.length - 1]
      compatible = isCompatible(destination.location, card, topCard)
      if (!compatible) return
    } catch (err) {
      console.info(err)
      return
    }

    try {
      if (destination.location === CardSource.Lake)
        handleUpdateLake({
          destination: destination.index,
          source,
          sourceIndex: pileIndex,
        })
      if (destination.location === CardSource.River) {
        if (source === CardSource.River)
          handleUpdateRiver({
            destination: destination.index,
            source,
            sourceIndex: pileIndex!,
            start: foundationIndex,
          })
        else if (source === CardSource.Lake)
          handleUpdateRiver({
            destination: destination.index,
            source,
            sourceIndex: pileIndex!,
          })
        else handleUpdateRiver({ destination: destination.index, source })
      }
    } catch (err) {
      console.info(err)
      return
    }
  }

  /* board */
  return (
    <>
      <Container
        className="h-full items-center pt-4 sm:pt-16"
        onClick={() => {
          showInfo ? setShowInfo(false) : null
        }}
      >
        <LayoutGroup>
          <div className="rounded-2xl sm:border sm:border-zinc-100 sm:p-8 sm:dark:border-zinc-700/40">
            {/* lake */}
            <Lake
              lake={lake}
              playCard={playCard}
              onDragEnd={dropCard}
              disabled={gameOver || showInfo}
            />
            {/* tableau */}
            <Tableau
              river={river}
              playCard={playCard}
              onDragEnd={dropCard}
              disabled={gameOver || showInfo}
            />
            {/* stream & waste */}
            <div className="flex justify-between">
              <div></div>
              <Stream
                stream={stream}
                waste={waste}
                maxWasteShowing={maxWasteShowing}
                playCard={playCard}
                wasteCards={wasteCards}
                onDragEnd={dropCard}
                disabled={gameOver || showInfo}
              />
              <div className="flex gap-4 place-self-end">
                <button
                  title="Refresh game"
                  type="button"
                  aria-label="Refresh game"
                  className="group rounded-full bg-white/90 px-2 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  onClick={() => window.location.reload()}
                >
                  <RefreshIcon className="h-6 w-6 fill-transparent stroke-teal-500 transition group-hover:stroke-teal-600 dark:fill-transparent dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                </button>
                <button
                  title={showInfo ? 'Close' : 'More info'}
                  type="button"
                  aria-label={showInfo ? 'Hide game info' : 'Show game info'}
                  className="group rounded-full bg-white/90 px-2 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <InfoIcon
                    className={`${
                      showInfo ? 'hidden' : ''
                    } h-6 w-6 fill-teal-400/10 stroke-teal-500 transition group-hover:stroke-teal-600 dark:fill-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400`}
                  />
                  <XIcon
                    className={`${
                      showInfo ? '' : 'hidden'
                    } h-6 w-6 fill-teal-400/10 stroke-teal-500 transition group-hover:stroke-teal-600 dark:fill-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400`}
                  />
                </button>
              </div>
            </div>
          </div>
        </LayoutGroup>
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.2,
                delay: 0.1,
                ease: 'easeInOut',
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="sm:pt-18 z-10000 absolute inset-16 mx-auto my-auto flex flex-col rounded-2xl border-zinc-100 bg-zinc-300/40 p-6 shadow-2xl shadow-zinc-700 backdrop-blur-lg dark:bg-zinc-800/40 dark:shadow-zinc-950 sm:inset-36"
            >
              <div className="overflow-auto">
                <h2 className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center">
                    <InfoIcon className="h-6 w-6 fill-teal-400/10 stroke-teal-500 transition group-hover:stroke-teal-600 dark:fill-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                    <span className="ml-3">How to play</span>
                  </div>
                </h2>
                <Container className="mt-4 sm:mt-8">
                  <header className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                      Solitaire
                    </h1>
                  </header>
                  <div className="mt-4 sm:mt-8">
                    <p>
                      In this card game, your goal is to arrange all the cards
                      into four piles, one for each suit, in ascending order
                      from Ace to King.
                    </p>
                    <br />
                    <p>
                      Start by clicking or dragging cards to form a sequence of
                      cards in descending order (from King to Ace) and
                      alternating colors (red and black) in the tableau. You can
                      move cards individually or in groups. If you find an Ace,
                      move it to the foundation piles at the top, where
                      you&apos;ll build up each suit from Ace to King.
                    </p>
                    <br />
                    <p>
                      Don&apos;t forget to use the deck at the bottom! Click on
                      it to reveal new cards. If you get stuck, remember you can
                      place a King or a sequence starting with a King into an
                      empty slot. Keep arranging the cards until all cards are
                      in four piles!
                    </p>
                    <br />
                  </div>
                </Container>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  )
}
