'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { requireUserId } from '@/lib/auth-server'
import { db } from '@/db/client'
import { macroTargets } from '@/db/schema'
import { DEFAULT_TARGETS, type MacroTargets } from '@/lib/macro-targets'

export async function getMacroTargets(): Promise<MacroTargets> {
  const userId = await requireUserId()

  const row = await db.query.macroTargets.findFirst({
    where: eq(macroTargets.userId, userId),
  })
  if (!row) return DEFAULT_TARGETS

  return {
    calories: row.calories,
    proteinG: row.proteinG,
    netCarbsG: row.netCarbsG,
    fatG: row.fatG,
  }
}

export async function saveMacroTargets(input: MacroTargets): Promise<void> {
  const userId = await requireUserId()

  await db
    .insert(macroTargets)
    .values({ userId, ...input })
    .onConflictDoUpdate({
      target: macroTargets.userId,
      set: { ...input, updatedAt: new Date() },
    })

  revalidatePath('/tools/macros')
  revalidatePath('/tools/macros/settings')
}
