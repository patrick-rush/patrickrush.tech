'use client'

import { useEffect, useState } from 'react'
import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from 'date-fns'
import { getMealsInRange, type MealRow } from '@/lib/meals-actions'
import { TodayTotals, type TodayTotalsValue } from './TodayTotals'
import { MacroTrendChart, type DailyTotal } from './MacroTrendChart'

const TREND_DAYS = 14

function emptyTotals(): TodayTotalsValue {
  return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
}

// Owns the one piece of local-timezone-dependent logic on the page: "today"
// and "the last 14 days" only mean something relative to the browser's
// clock, so this fetches raw meals server-side (range computed here, on the
// client) and buckets them by local calendar day here too.
export function MacrosOverview({ refreshKey }: { refreshKey: number }) {
  const [loading, setLoading] = useState(true)
  const [today, setToday] = useState<TodayTotalsValue>(emptyTotals())
  const [trend, setTrend] = useState<DailyTotal[]>([])

  useEffect(() => {
    let cancelled = false
    const now = new Date()
    const rangeStart = startOfDay(subDays(now, TREND_DAYS - 1))

    getMealsInRange(rangeStart.toISOString(), now.toISOString()).then(
      (rows: MealRow[]) => {
        if (cancelled) return

        const todayKey = format(now, 'yyyy-MM-dd')
        const byDay = new Map<string, MealRow[]>()
        for (const row of rows) {
          const key = format(parseISO(row.loggedAt), 'yyyy-MM-dd')
          byDay.set(key, [...(byDay.get(key) ?? []), row])
        }

        const todayRows = byDay.get(todayKey) ?? []
        setToday(
          todayRows.reduce(
            (acc, r) => ({
              calories: acc.calories + r.calories,
              proteinG: acc.proteinG + r.proteinG,
              carbsG: acc.carbsG + r.carbsG,
              fatG: acc.fatG + r.fatG,
            }),
            emptyTotals(),
          ),
        )

        const days = eachDayOfInterval({ start: rangeStart, end: now })
        setTrend(
          days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayRows = byDay.get(key) ?? []
            return dayRows.reduce(
              (acc, r) => ({
                date: key,
                calories: acc.calories + r.calories,
                proteinG: acc.proteinG + r.proteinG,
                carbsG: acc.carbsG + r.carbsG,
                fatG: acc.fatG + r.fatG,
              }),
              { date: key, calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
            )
          }),
        )
        setLoading(false)
      },
    )

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

  return (
    <div className="space-y-8">
      <TodayTotals totals={today} />
      <MacroTrendChart data={trend} />
    </div>
  )
}
