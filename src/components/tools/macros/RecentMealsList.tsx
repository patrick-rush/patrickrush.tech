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

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function CopyIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function PencilIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <line x1="16" y1="5" x2="19" y2="8" />
    </svg>
  )
}

function TrashIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...iconProps} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function ActionButton({
  onClick,
  disabled,
  label,
  className,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${className ?? ''}`}
    >
      {children}
    </button>
  )
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
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {meal.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {format(parseISO(meal.loggedAt), 'EEE, MMM d · h:mm a')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <ActionButton
                    onClick={() => onDuplicate(meal.id)}
                    disabled={busyId === meal.id}
                    label="Duplicate"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton onClick={() => startEdit(meal)} label="Edit">
                    <PencilIcon className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => onDelete(meal.id)}
                    disabled={busyId === meal.id}
                    label="Delete"
                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </ActionButton>
                </div>
              </div>
              <p className="mt-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {meal.calories.toLocaleString()} cal
                </span>
                {' · '}
                {Math.round(meal.proteinG)}g protein · {meal.netCarbsG.toFixed(1)}g net carbs ·{' '}
                {Math.round(meal.fatG)}g fat
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
