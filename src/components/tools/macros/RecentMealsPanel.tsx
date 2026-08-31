'use client'

import { useEffect, useState } from 'react'
import { getRecentMeals, type MealRow } from '@/lib/meals-actions'
import { RecentMealsList } from './RecentMealsList'

export function RecentMealsPanel({
  limit,
  refreshKey,
  onChanged,
}: {
  limit: number
  refreshKey?: number
  // Called (in addition to this panel's own refetch below) when a meal is
  // edited/deleted here, so a parent holding sibling components — e.g. the
  // dashboard's TodayTotals/MacroTrendChart — can refresh them too.
  onChanged?: () => void
}) {
  const [meals, setMeals] = useState<MealRow[] | null>(null)
  // Bumped after an edit/delete so this panel refetches even on pages (like
  // /tools/macros/history) with no parent refreshKey to react to.
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    let cancelled = false
    getRecentMeals(limit).then((rows) => {
      if (!cancelled) setMeals(rows)
    })
    return () => {
      cancelled = true
    }
  }, [limit, refreshKey, localRefresh])

  if (meals === null) {
    return (
      <div className="h-40 animate-pulse rounded-2xl border border-zinc-100 dark:border-zinc-700/40" />
    )
  }

  return (
    <RecentMealsList
      meals={meals}
      onChanged={() => {
        setLocalRefresh((k) => k + 1)
        onChanged?.()
      }}
    />
  )
}
