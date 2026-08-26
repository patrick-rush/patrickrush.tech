'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/Button'
import { estimateMealMacros, saveMeal } from '@/lib/meals-actions'
import { MacroFieldsEditor, type MacroFieldsValue } from './MacroFieldsEditor'

function nowForInput() {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm")
}

const emptyFields: MacroFieldsValue = {
  name: '',
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  loggedAt: nowForInput(),
}

export function MealEntryForm() {
  const router = useRouter()
  const [phase, setPhase] = useState<'input' | 'review'>('input')
  const [rawInput, setRawInput] = useState('')
  const [fields, setFields] = useState<MacroFieldsValue>(emptyFields)
  const [estimating, setEstimating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onEstimate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEstimating(true)
    setError(null)

    const result = await estimateMealMacros(rawInput)

    setEstimating(false)
    if (result.ok) {
      setFields({
        name: result.estimate.name,
        calories: result.estimate.calories,
        proteinG: result.estimate.protein_g,
        carbsG: result.estimate.carbs_g,
        fatG: result.estimate.fat_g,
        loggedAt: nowForInput(),
      })
    } else {
      setError(result.error)
      setFields({ ...emptyFields, loggedAt: nowForInput() })
    }
    setPhase('review')
  }

  async function onSave() {
    setSaving(true)
    await saveMeal({
      rawInput,
      name: fields.name,
      calories: fields.calories,
      proteinG: fields.proteinG,
      carbsG: fields.carbsG,
      fatG: fields.fatG,
      loggedAt: fields.loggedAt,
    })
    setSaving(false)
    setPhase('input')
    setRawInput('')
    setFields(emptyFields)
    router.refresh()
  }

  function onStartOver() {
    setPhase('input')
    setError(null)
  }

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Log a meal
      </h2>

      {phase === 'input' && (
        <form onSubmit={onEstimate} className="mt-4">
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="What did you eat? e.g. 'grilled chicken breast with rice and broccoli'"
            aria-label="Meal description"
            required
            rows={3}
            className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm w-full"
          />
          <div className="mt-4">
            <Button type="submit" disabled={estimating}>
              {estimating ? 'Estimating…' : 'Estimate'}
            </Button>
          </div>
        </form>
      )}

      {phase === 'review' && (
        <div className="mt-4">
          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <MacroFieldsEditor value={fields} onChange={setFields} />
          <div className="mt-4 flex gap-3">
            <Button onClick={onSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={onStartOver} disabled={saving}>
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
