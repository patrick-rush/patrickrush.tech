'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/Button'
import { deleteMeal, duplicateMeal, updateMeal, type MealRow } from '@/lib/meals-actions'
import { MacroFieldsEditor, type MacroFieldsValue } from './MacroFieldsEditor'

function toEditValues(meal: MealRow): MacroFieldsValue {
  return {
    name: meal.name,
    calories: meal.calories,
    proteinG: meal.proteinG,
    netCarbsG: meal.netCarbsG,
    fatG: meal.fatG,
    // datetime-local wants a timezone-naive local string; parseISO + format
    // both resolve in the browser's local time, which is what we want here.
    loggedAt: format(parseISO(meal.loggedAt), "yyyy-MM-dd'T'HH:mm"),
  }
}

export function RecentMealsList({
  meals,
  onChanged,
}: {
  meals: MealRow[]
  onChanged?: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<MacroFieldsValue | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  function startEdit(meal: MealRow) {
    setEditingId(meal.id)
    setEditValues(toEditValues(meal))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValues(null)
  }

  async function saveEdit(id: string) {
    if (!editValues) return
    setBusyId(id)
    try {
      await updateMeal({
        id,
        name: editValues.name,
        calories: editValues.calories,
        proteinG: editValues.proteinG,
        netCarbsG: editValues.netCarbsG,
        fatG: editValues.fatG,
        // Resolve the naive datetime-local string to an absolute instant
        // here, in the browser — the server (UTC on Vercel) would otherwise
        // reinterpret it in the wrong timezone.
        loggedAt: new Date(editValues.loggedAt).toISOString(),
      })
      setEditingId(null)
      setEditValues(null)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm('Delete this meal?')) return
    setBusyId(id)
    try {
      await deleteMeal(id)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  async function onDuplicate(id: string) {
    setBusyId(id)
    try {
      await duplicateMeal(id)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

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
        <li key={meal.id} className="py-3">
          {editingId === meal.id && editValues ? (
            <div>
              <MacroFieldsEditor value={editValues} onChange={setEditValues} />
              <div className="mt-3 flex gap-3">
                <Button onClick={() => saveEdit(meal.id)} disabled={busyId === meal.id}>
                  {busyId === meal.id ? 'Saving…' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={cancelEdit} disabled={busyId === meal.id}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {meal.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {format(parseISO(meal.loggedAt), 'EEE, MMM d · h:mm a')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {meal.calories.toLocaleString()} cal
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {Math.round(meal.proteinG)}p · {meal.netCarbsG.toFixed(1)}c ·{' '}
                    {Math.round(meal.fatG)}f
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => onDuplicate(meal.id)}
                    disabled={busyId === meal.id}
                    className="font-medium text-teal-600 hover:text-teal-500 disabled:opacity-50 dark:text-teal-400"
                  >
                    {busyId === meal.id ? '…' : 'Duplicate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(meal)}
                    className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(meal.id)}
                    disabled={busyId === meal.id}
                    className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
                  >
                    {busyId === meal.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
