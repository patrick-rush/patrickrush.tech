import Link from 'next/link'
import { MacrosDashboard } from '@/components/tools/macros/MacrosDashboard'

export default function MacrosPage() {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Macros
        </h1>
        <div className="flex gap-4">
          <Link
            href="/tools/macros/settings"
            className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
          >
            Targets
          </Link>
          <Link
            href="/tools/macros/history"
            className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
          >
            View history
          </Link>
        </div>
      </div>
      <div className="mt-10 max-w-2xl">
        <MacrosDashboard />
      </div>
    </div>
  )
}
