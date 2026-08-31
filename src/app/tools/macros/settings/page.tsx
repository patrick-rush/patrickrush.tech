import Link from 'next/link'
import { getMacroTargets } from '@/lib/macro-targets-actions'
import { MacroTargetsForm } from '@/components/tools/macros/MacroTargetsForm'

export default async function MacroSettingsPage() {
  const targets = await getMacroTargets()

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Macro targets
        </h1>
        <Link
          href="/tools/macros"
          className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="mt-10">
        <MacroTargetsForm initial={targets} />
      </div>
    </div>
  )
}
