'use server'

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { revalidatePath } from 'next/cache'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { anthropic } from '@/lib/anthropic-client'
import { requireUserId } from '@/lib/auth-server'
import { db } from '@/db/client'
import { meals } from '@/db/schema'
import { MacroEstimateSchema, type MacroEstimate } from '@/lib/meals-schema'

type EstimateResult =
  | { ok: true; estimate: MacroEstimate }
  | { ok: false; error: string }

export async function estimateMealMacros(
  rawInput: string,
): Promise<EstimateResult> {
  try {
    await requireUserId()

    const response = await anthropic.messages.parse({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system:
        'You are a nutrition estimation assistant. Given a free-text meal ' +
        'description, estimate calories and macronutrients using standard ' +
        'nutrition data and typical portion sizes when unspecified. Round ' +
        'calories to the nearest 10, macros to the nearest 1g.',
      messages: [{ role: 'user', content: rawInput }],
      output_config: { format: zodOutputFormat(MacroEstimateSchema) },
    })

    if (!response.parsed_output) {
      return {
        ok: false,
        error: 'Could not parse a macro estimate — try rephrasing or enter values manually.',
      }
    }
    return { ok: true, estimate: response.parsed_output }
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return { ok: false, error: 'Rate limited — try again shortly.' }
    }
    if (err instanceof Anthropic.APIError) {
      return { ok: false, error: 'Estimation failed — enter values manually.' }
    }
    if (err instanceof Error && err.message === 'Not authenticated') {
      return { ok: false, error: 'Your session expired — refresh the page and sign in again.' }
    }
    return { ok: false, error: 'Unexpected error — enter values manually.' }
  }
}

export type SaveMealInput = {
  rawInput: string
  name: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  loggedAt: string
}

export async function saveMeal(input: SaveMealInput): Promise<void> {
  const userId = await requireUserId()

  await db.insert(meals).values({
    userId,
    rawInput: input.rawInput,
    name: input.name,
    calories: input.calories,
    proteinG: input.proteinG,
    carbsG: input.carbsG,
    fatG: input.fatG,
    loggedAt: new Date(input.loggedAt),
  })

  revalidatePath('/tools/macros')
}

export type MealRow = {
  id: string
  name: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  loggedAt: string
}

function toMealRow(row: typeof meals.$inferSelect): MealRow {
  return {
    id: row.id,
    name: row.name,
    calories: row.calories,
    proteinG: row.proteinG,
    carbsG: row.carbsG,
    fatG: row.fatG,
    loggedAt: row.loggedAt.toISOString(),
  }
}

// Generic range query — the caller supplies the boundaries, since "today"
// and "the last 14 days" only mean something relative to the browser's
// local timezone, not the server's (Vercel functions run in UTC).
export async function getMealsInRange(
  startISO: string,
  endISO: string,
): Promise<MealRow[]> {
  const userId = await requireUserId()

  const rows = await db
    .select()
    .from(meals)
    .where(
      and(
        eq(meals.userId, userId),
        gte(meals.loggedAt, new Date(startISO)),
        lte(meals.loggedAt, new Date(endISO)),
      ),
    )
    .orderBy(meals.loggedAt)

  return rows.map(toMealRow)
}

export async function getRecentMeals(limit: number): Promise<MealRow[]> {
  const userId = await requireUserId()

  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, userId))
    .orderBy(desc(meals.loggedAt))
    .limit(limit)

  return rows.map(toMealRow)
}
