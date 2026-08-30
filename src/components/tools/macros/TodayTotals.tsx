const tiles = [
  { key: 'calories', label: 'Calories', suffix: '', decimals: 0 },
  { key: 'proteinG', label: 'Protein', suffix: 'g', decimals: 0 },
  { key: 'netCarbsG', label: 'Net carbs', suffix: 'g', decimals: 1 },
  { key: 'fatG', label: 'Fat', suffix: 'g', decimals: 0 },
] as const

export type TodayTotalsValue = {
  calories: number
  proteinG: number
  netCarbsG: number
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
            {totals[tile.key].toLocaleString(undefined, {
              minimumFractionDigits: tile.decimals,
              maximumFractionDigits: tile.decimals,
            })}
            {tile.suffix}
          </p>
        </div>
      ))}
    </div>
  )
}
