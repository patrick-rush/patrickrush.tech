import Link from 'next/link'

export default function ToolsIndex() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Tools
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/tools/macros"
          className="rounded-2xl border border-zinc-100 p-6 hover:border-teal-500 dark:border-zinc-700/40 dark:hover:border-teal-400"
        >
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Macro Tracker
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Log meals, get AI macro estimates, track daily totals.
          </p>
        </Link>
      </div>
    </div>
  )
}
