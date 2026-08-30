'use client'

import { useEffect, useState } from 'react'
import { startOfDay } from 'date-fns'
import { getMealsInRange, type MealRow } from '@/lib/meals-actions'
import { TodayTotals, type TodayTotalsValue } from './TodayTotals'

function emptyTotals(): TodayTotalsValue {
  return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
}

// "Today" only means something relative to the browser's local clock
// (Vercel functions run in UTC), so the range is computed here, on the
// client, rather than server-side.
export function MacrosOverview({ refreshKey }: { refreshKey: number }) {
  const [loading, setLoading] = useState(true)
  const [today, setToday] = useState<TodayTotalsValue>(emptyTotals())

  useEffect(() => {
    let cancelled = false
    const now = new Date()
    const start = startOfDay(now)

    getMealsInRange(start.toISOString(), now.toISOString()).then((rows: MealRow[]) => {
      if (cancelled) return
      setToday(
        rows.reduce(
          (acc, r) => ({
            calories: acc.calories + r.calories,
            proteinG: acc.proteinG + r.proteinG,
            carbsG: acc.carbsG + r.carbsG,
            fatG: acc.fatG + r.fatG,
          }),
          emptyTotals(),
        ),
      )
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-zinc-100 dark:border-zinc-700/40"
          />
        ))}
      </div>
    )
  }

  return <TodayTotals totals={today} />
}
