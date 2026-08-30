'use client'

export type MacroFieldsValue = {
  name: string
  calories: number
  proteinG: number
  netCarbsG: number
  fatG: number
  loggedAt: string
}

const inputClassName =
  'min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm'

const labelClassName =
  'block text-xs font-medium text-zinc-600 dark:text-zinc-400'

export function MacroFieldsEditor({
  value,
  onChange,
}: {
  value: MacroFieldsValue
  onChange: (value: MacroFieldsValue) => void
}) {
  function set<K extends keyof MacroFieldsValue>(key: K, val: MacroFieldsValue[K]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className={labelClassName}>Name</label>
        <input
          type="text"
          className={`${inputClassName} mt-1 w-full`}
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClassName}>Calories</label>
        <input
          type="number"
          className={`${inputClassName} mt-1 w-full`}
          value={value.calories}
          onChange={(e) => set('calories', Number(e.target.value))}
        />
      </div>
      <div>
        <label className={labelClassName}>When</label>
        <input
          type="datetime-local"
          className={`${inputClassName} mt-1 w-full`}
          value={value.loggedAt}
          onChange={(e) => set('loggedAt', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClassName}>Protein (g)</label>
        <input
          type="number"
          className={`${inputClassName} mt-1 w-full`}
          value={value.proteinG}
          onChange={(e) => set('proteinG', Number(e.target.value))}
        />
      </div>
      <div>
        <label className={labelClassName}>Net carbs (g)</label>
        <input
          type="number"
          step="0.5"
          className={`${inputClassName} mt-1 w-full`}
          value={value.netCarbsG}
          onChange={(e) => set('netCarbsG', Number(e.target.value))}
        />
      </div>
      <div>
        <label className={labelClassName}>Fat (g)</label>
        <input
          type="number"
          className={`${inputClassName} mt-1 w-full`}
          value={value.fatG}
          onChange={(e) => set('fatG', Number(e.target.value))}
        />
      </div>
    </div>
  )
}
