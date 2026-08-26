import { MealEntryForm } from '@/components/tools/macros/MealEntryForm'

export default function MacrosPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Macros
      </h1>
      <div className="mt-10 max-w-xl">
        <MealEntryForm />
      </div>
    </div>
  )
}
