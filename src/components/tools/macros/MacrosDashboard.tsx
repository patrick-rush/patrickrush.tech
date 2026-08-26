'use client'

import { useState } from 'react'
import { MealEntryForm } from './MealEntryForm'
import { MacrosOverview } from './MacrosOverview'
import { RecentMealsPanel } from './RecentMealsPanel'

export function MacrosDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-8">
      <MealEntryForm onSaved={() => setRefreshKey((k) => k + 1)} />
      <MacrosOverview refreshKey={refreshKey} />
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Recent meals
        </h2>
        <div className="mt-4">
          <RecentMealsPanel limit={8} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}
