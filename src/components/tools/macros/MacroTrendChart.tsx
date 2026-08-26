'use client'

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
import { format, parseISO } from 'date-fns'

export type DailyTotal = {
  date: string // yyyy-MM-dd
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

// Sequential blue, one hue — matches the reference dataviz palette's
// series-1 slot, synced to the site's next-themes toggle.
const LINE_COLOR = { light: '#2a78d6', dark: '#3987e5' }
const GRID_COLOR = { light: '#e1e0d9', dark: '#2c2c2a' }
const AXIS_COLOR = '#898781'

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: DailyTotal }[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="rounded-md border border-zinc-900/10 bg-white px-3 py-2 text-sm shadow-md dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {format(parseISO(d.date), 'EEE, MMM d')}
      </p>
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
        {d.calories.toLocaleString()} cal
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        {Math.round(d.proteinG)}g protein · {Math.round(d.carbsG)}g carbs ·{' '}
        {Math.round(d.fatG)}g fat
      </p>
    </div>
  )
}

export function MacroTrendChart({ data }: { data: DailyTotal[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const lineColor = isDark ? LINE_COLOR.dark : LINE_COLOR.light
  const gridColor = isDark ? GRID_COLOR.dark : GRID_COLOR.light

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Calories, last 14 days
      </h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), 'MMM d')}
              stroke={AXIS_COLOR}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              stroke={AXIS_COLOR}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{ stroke: gridColor, strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: lineColor, stroke: isDark ? '#1a1a19' : '#fcfcfb', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
