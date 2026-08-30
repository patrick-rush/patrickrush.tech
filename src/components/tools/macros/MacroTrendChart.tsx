'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { LabelProps } from 'recharts'
import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from 'date-fns'
import { getMealsInRange, type MealRow } from '@/lib/meals-actions'

type SeriesKey = 'calories' | 'proteinG' | 'netCarbsG' | 'fatG'
type Range = 'today' | 'week' | 'month'

// t: epoch ms — always plotted on a real numeric time axis, so gaps between
// meals (Today) or between days (Week/Month) are spatially proportional
// rather than evenly spaced by category.
type Point = {
  t: number
  calories: number
  proteinG: number
  netCarbsG: number
  fatG: number
}

// Fixed categorical slots (1/2/3/4 from the reference palette) — assigned
// once per macro and never reassigned when a series is toggled, so a
// hidden/shown series never repaints the others.
const SERIES: { key: SeriesKey; label: string; color: { light: string; dark: string } }[] = [
  { key: 'calories', label: 'Calories', color: { light: '#2a78d6', dark: '#3987e5' } },
  { key: 'proteinG', label: 'Protein', color: { light: '#eb6834', dark: '#d95926' } },
  { key: 'netCarbsG', label: 'Net carbs', color: { light: '#1baf7a', dark: '#199e70' } },
  { key: 'fatG', label: 'Fat', color: { light: '#eda100', dark: '#c98500' } },
]

const RANGES: { key: Range; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

const GRID_COLOR = { light: '#e1e0d9', dark: '#2c2c2a' }
const AXIS_COLOR = '#898781'

// Net carbs are tracked to 0.5g precision (matters at keto's low daily
// budget); everything else displays as a whole number.
function formatValue(key: SeriesKey, value: number): string {
  return key === 'netCarbsG'
    ? value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : Math.round(value).toLocaleString()
}

function fetchWindow(range: Range) {
  const now = new Date()
  if (range === 'today') return { start: startOfDay(now), end: now }
  const days = range === 'week' ? 6 : 29
  return { start: startOfDay(subDays(now, days)), end: now }
}

function tickFormat(range: Range, t: number) {
  return range === 'today' ? format(t, 'ha') : format(t, 'MMM d')
}

function tooltipFormat(range: Range, t: number) {
  return range === 'today' ? format(t, 'h:mm a') : format(t, 'EEE, MMM d')
}

// "Today": a running cumulative total that rises as meals are logged, so the
// line shows progress through the day toward a target rather than discrete
// per-hour amounts — that's the actual question ("how am I tracking today"),
// not "how much did I eat in each hour."
function cumulativeToday(rows: MealRow[]): Point[] {
  const { start, end } = fetchWindow('today')
  const sorted = [...rows].sort(
    (a, b) => parseISO(a.loggedAt).getTime() - parseISO(b.loggedAt).getTime(),
  )

  const points: Point[] = [{ t: start.getTime(), calories: 0, proteinG: 0, netCarbsG: 0, fatG: 0 }]
  let running = { calories: 0, proteinG: 0, netCarbsG: 0, fatG: 0 }
  for (const r of sorted) {
    running = {
      calories: running.calories + r.calories,
      proteinG: running.proteinG + r.proteinG,
      netCarbsG: running.netCarbsG + r.netCarbsG,
      fatG: running.fatG + r.fatG,
    }
    points.push({ t: parseISO(r.loggedAt).getTime(), ...running })
  }
  // Extend the line flat to "now" so it doesn't stop at the last meal.
  points.push({ t: end.getTime(), ...running })
  return points
}

// Week/Month: one point per day, that day's total — not cumulative.
function dailyTotals(rows: MealRow[], range: Range): Point[] {
  const { start, end } = fetchWindow(range)
  const days = eachDayOfInterval({ start, end })

  const byDay = new Map<string, MealRow[]>()
  for (const row of rows) {
    const key = format(parseISO(row.loggedAt), 'yyyy-MM-dd')
    byDay.set(key, [...(byDay.get(key) ?? []), row])
  }

  return days.map((day) => {
    const key = format(day, 'yyyy-MM-dd')
    const dayRows = byDay.get(key) ?? []
    return dayRows.reduce(
      (acc, r) => ({
        t: acc.t,
        calories: acc.calories + r.calories,
        proteinG: acc.proteinG + r.proteinG,
        netCarbsG: acc.netCarbsG + r.netCarbsG,
        fatG: acc.fatG + r.fatG,
      }),
      { t: day.getTime(), calories: 0, proteinG: 0, netCarbsG: 0, fatG: 0 },
    )
  })
}

function TrendTooltip({
  active,
  payload,
  visible,
  range,
  colorFor,
}: {
  active?: boolean
  payload?: { payload: Point }[]
  visible: Record<SeriesKey, boolean>
  range: Range
  colorFor: (key: SeriesKey) => string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="rounded-md border border-zinc-900/10 bg-white px-3 py-2 text-sm shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{tooltipFormat(range, d.t)}</p>
      <div className="mt-1 space-y-0.5">
        {SERIES.filter((s) => visible[s.key]).map((s) => (
          <p key={s.key} className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
            <span
              className="inline-block h-0.5 w-3 rounded-full"
              style={{ backgroundColor: colorFor(s.key) }}
            />
            <span className="font-semibold">
              {formatValue(s.key, d[s.key])}
              {s.key === 'calories' ? ' cal' : 'g'}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

// Direct end-of-line value label — required relief for the two
// default-visible series (carbs/fat) whose light-mode hues sit below 3:1
// contrast against the chart surface (see dataviz skill's contrast check).
function endLabel(color: string, data: Point[], key: SeriesKey, suffix: string) {
  function EndLabel(props: LabelProps) {
    const { x, y, index, value } = props
    if (index !== data.length - 1 || typeof x !== 'number' || typeof y !== 'number') {
      return null
    }
    return (
      <text x={x + 6} y={y} dy={4} fill={color} fontSize={11} fontWeight={600}>
        {formatValue(key, Number(value))}
        {suffix}
      </text>
    )
  }
  return EndLabel
}

export function MacroTrendChart({ refreshKey }: { refreshKey: number }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [range, setRange] = useState<Range>('today')
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    calories: false,
    proteinG: false,
    netCarbsG: true,
    fatG: true,
  })
  const [rows, setRows] = useState<MealRow[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const { start, end } = fetchWindow(range)
    getMealsInRange(start.toISOString(), end.toISOString()).then((result) => {
      if (!cancelled) setRows(result)
    })
    return () => {
      cancelled = true
    }
  }, [range, refreshKey])

  const data = useMemo(
    () => (range === 'today' ? cumulativeToday(rows ?? []) : dailyTotals(rows ?? [], range)),
    [rows, range],
  )
  const { start, end } = fetchWindow(range)

  const colorFor = (key: SeriesKey) => {
    const s = SERIES.find((s) => s.key === key)!
    return isDark ? s.color.dark : s.color.light
  }
  const gridColor = isDark ? GRID_COLOR.dark : GRID_COLOR.light

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Macro trend
        </h2>
        <div className="flex gap-1 rounded-md border border-zinc-900/10 p-0.5 dark:border-zinc-700">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                range === r.key
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-600'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes double as the legend: each row keys a series with its
          fixed color swatch, satisfying "identity is never color-alone". */}
      <div className="mt-4 flex flex-wrap gap-4">
        {SERIES.map((s) => (
          <label
            key={s.key}
            className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300"
          >
            <input
              type="checkbox"
              checked={visible[s.key]}
              onChange={(e) => setVisible({ ...visible, [s.key]: e.target.checked })}
              className="h-3.5 w-3.5 rounded border-zinc-400 text-teal-500 focus:ring-teal-500/50"
            />
            <span
              className="inline-block h-0.5 w-3 rounded-full"
              style={{ backgroundColor: colorFor(s.key) }}
            />
            {s.label}
          </label>
        ))}
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 40, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="t"
              type="number"
              domain={[start.getTime(), end.getTime()]}
              tickFormatter={(t) => tickFormat(range, t)}
              stroke={AXIS_COLOR}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip
              content={<TrendTooltip visible={visible} range={range} colorFor={colorFor} />}
              cursor={{ stroke: gridColor, strokeWidth: 1 }}
            />
            {SERIES.filter((s) => visible[s.key]).map((s) => (
              <Line
                key={s.key}
                type={range === 'today' ? 'stepAfter' : 'monotone'}
                dataKey={s.key}
                stroke={colorFor(s.key)}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={{ r: 3, fill: colorFor(s.key), strokeWidth: 0 }}
                activeDot={{ r: 5, fill: colorFor(s.key), stroke: isDark ? '#1a1a19' : '#fcfcfb', strokeWidth: 2 }}
                label={endLabel(colorFor(s.key), data, s.key, s.key === 'calories' ? '' : 'g')}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
