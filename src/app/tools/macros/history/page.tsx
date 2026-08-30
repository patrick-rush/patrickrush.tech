import Link from 'next/link'
import { RecentMealsPanel } from '@/components/tools/macros/RecentMealsPanel'

export default function MacrosHistoryPage() {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Meal history
        </h1>
        <Link
          href="/tools/macros"
          className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="mt-10 max-w-2xl rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <RecentMealsPanel limit={200} />
      </div>
    </div>
  )
}
