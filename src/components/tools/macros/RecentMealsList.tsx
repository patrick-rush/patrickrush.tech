import { format, parseISO } from 'date-fns'
import type { MealRow } from '@/lib/meals-actions'

export function RecentMealsList({ meals }: { meals: MealRow[] }) {
  if (meals.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No meals logged yet.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
      {meals.map((meal) => (
        <li key={meal.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {meal.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {format(parseISO(meal.loggedAt), 'EEE, MMM d · h:mm a')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {meal.calories.toLocaleString()} cal
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {Math.round(meal.proteinG)}p · {meal.netCarbsG.toFixed(1)}c ·{' '}
              {Math.round(meal.fatG)}f
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
