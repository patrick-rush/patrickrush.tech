'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { saveMacroTargets } from '@/lib/macro-targets-actions'
import type { MacroTargets } from '@/lib/macro-targets'

const inputClassName =
  'min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm'

const labelClassName = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400'

const FIELDS: { key: keyof MacroTargets; label: string; step: string }[] = [
  { key: 'calories', label: 'Calories', step: '10' },
  { key: 'proteinG', label: 'Protein (g)', step: '1' },
  { key: 'netCarbsG', label: 'Net carbs (g)', step: '0.5' },
  { key: 'fatG', label: 'Fat (g)', step: '1' },
]

export function MacroTargetsForm({ initial }: { initial: MacroTargets }) {
  const router = useRouter()
  const [values, setValues] = useState<MacroTargets>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await saveMacroTargets(values)
      setSaved(true)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClassName}>{field.label}</label>
            <input
              type="number"
              step={field.step}
              className={`${inputClassName} mt-1 w-full`}
              value={values[field.key]}
              onChange={(e) =>
                setValues({ ...values, [field.key]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save targets'}
        </Button>
        {saved && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Saved.</span>
        )}
      </div>
    </form>
  )
}
