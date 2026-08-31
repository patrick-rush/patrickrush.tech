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
  netCarbsG: 0,
  fatG: 0,
  loggedAt: nowForInput(),
}

export function MealEntryForm({ onSaved }: { onSaved?: () => void }) {
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

    let result: Awaited<ReturnType<typeof estimateMealMacros>> | undefined
    try {
      result = await estimateMealMacros(rawInput)
    } catch {
      result = undefined
    }

    setEstimating(false)
    if (result?.ok) {
      setFields({
        name: result.estimate.name,
        calories: result.estimate.calories,
        proteinG: result.estimate.proteinG,
        netCarbsG: result.estimate.netCarbsG,
        fatG: result.estimate.fatG,
        loggedAt: nowForInput(),
      })
    } else {
      setError(
        result?.error ??
          'Something went wrong reaching the server — try refreshing the page.',
      )
      setFields({ ...emptyFields, loggedAt: nowForInput() })
    }
    setPhase('review')
  }

  async function onSave() {
    setSaving(true)
    try {
      await saveMeal({
        // Manual entries (no AI estimate) may never have a description typed.
        rawInput: rawInput.trim() || '(entered manually)',
        name: fields.name,
        calories: fields.calories,
        proteinG: fields.proteinG,
        netCarbsG: fields.netCarbsG,
        fatG: fields.fatG,
        // fields.loggedAt is a timezone-naive "datetime-local" string —
        // resolve it to an absolute instant here, in the browser, where the
        // timezone is actually known. Sending the naive string as-is would
        // have the server (UTC on Vercel) reinterpret it in the wrong zone.
        loggedAt: new Date(fields.loggedAt).toISOString(),
      })
      setPhase('input')
      setRawInput('')
      setFields(emptyFields)
      router.refresh()
      onSaved?.()
    } catch {
      setError('Could not save — try refreshing the page and re-entering the meal.')
    } finally {
      setSaving(false)
    }
  }

  function onStartOver() {
    setPhase('input')
    setError(null)
  }

  function onEnterManually() {
    setError(null)
    setFields({ ...emptyFields, loggedAt: nowForInput() })
    setPhase('review')
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
          <div className="mt-4 flex gap-3">
            <Button type="submit" disabled={estimating}>
              {estimating ? 'Estimating…' : 'Estimate'}
            </Button>
            <Button type="button" variant="secondary" onClick={onEnterManually} disabled={estimating}>
              Enter manually
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
