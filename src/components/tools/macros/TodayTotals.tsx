const tiles = [
  { key: 'calories', label: 'Calories', suffix: '' },
  { key: 'proteinG', label: 'Protein', suffix: 'g' },
  { key: 'carbsG', label: 'Carbs', suffix: 'g' },
  { key: 'fatG', label: 'Fat', suffix: 'g' },
] as const

export type TodayTotalsValue = {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export function TodayTotals({ totals }: { totals: TodayTotalsValue }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-700/40"
        >
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {tile.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {Math.round(totals[tile.key]).toLocaleString()}
            {tile.suffix}
          </p>
        </div>
      ))}
    </div>
  )
}
