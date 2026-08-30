'use client'

import { useEffect, useState } from 'react'
import { getRecentMeals, type MealRow } from '@/lib/meals-actions'
import { RecentMealsList } from './RecentMealsList'

export function RecentMealsPanel({
  limit,
  refreshKey,
}: {
  limit: number
  refreshKey?: number
}) {
  const [meals, setMeals] = useState<MealRow[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getRecentMeals(limit).then((rows) => {
      if (!cancelled) setMeals(rows)
    })
    return () => {
      cancelled = true
    }
  }, [limit, refreshKey])

  if (meals === null) {
    return (
      <div className="h-40 animate-pulse rounded-2xl border border-zinc-100 dark:border-zinc-700/40" />
    )
  }

  return <RecentMealsList meals={meals} />
}
