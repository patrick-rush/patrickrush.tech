'use server'

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { revalidatePath } from 'next/cache'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { anthropic } from '@/lib/anthropic-client'
import { requireUserId } from '@/lib/auth-server'
import { db } from '@/db/client'
import { meals } from '@/db/schema'
import { MacroEstimateSchema, resolveMacros, type ResolvedMacros } from '@/lib/meals-schema'

type EstimateResult =
  | { ok: true; estimate: ResolvedMacros }
  | { ok: false; error: string }

const SYSTEM_PROMPT =
  'You are a precise nutrition estimation assistant helping someone track macros ' +
  'while following a strict ketogenic diet, where staying under a small daily ' +
  'net-carb budget (typically 15-30g) is essential. Accuracy on carbohydrates ' +
  'matters far more than on any other macro: do not pad your carb estimate with ' +
  "a safety margin, and do not round up \"just in case\" — but also do not omit " +
  'carbs that are genuinely present in an ingredient (vegetables, dairy, sauces, ' +
  'coatings). Base your estimate strictly on the ingredients actually described, ' +
  'using standard nutrition data for those specific foods and typical ' +
  'preparation/portion sizes only when a detail is left unspecified. Reason ' +
  'ingredient-by-ingredient internally before totaling. Report total ' +
  'carbohydrates and dietary fiber as separate fields so net carbs can be ' +
  'computed precisely elsewhere — do not subtract fiber yourself.'

export async function estimateMealMacros(
  rawInput: string,
): Promise<EstimateResult> {
  try {
    await requireUserId()

    const response = await anthropic.messages.parse({
      // Vercel Hobby caps serverless functions at 10s with no way to raise
      // it. claude-sonnet-5 measured 2.5-8.8s for this call alone (before
      // cold-start/network overhead) and was occasionally tipping over into
      // a 504. haiku-4-5 measured consistently under 2.5s.
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: rawInput }],
      output_config: { format: zodOutputFormat(MacroEstimateSchema) },
    })

    if (!response.parsed_output) {
      return {
        ok: false,
        error: 'Could not parse a macro estimate — try rephrasing or enter values manually.',
      }
    }
    return { ok: true, estimate: resolveMacros(response.parsed_output) }
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
  netCarbsG: number
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
    netCarbsG: input.netCarbsG,
    fatG: input.fatG,
    loggedAt: new Date(input.loggedAt),
  })

  revalidatePath('/tools/macros')
}

export type UpdateMealInput = {
  id: string
  name: string
  calories: number
  proteinG: number
  netCarbsG: number
  fatG: number
  loggedAt: string
}

export async function updateMeal(input: UpdateMealInput): Promise<void> {
  const userId = await requireUserId()

  await db
    .update(meals)
    .set({
      name: input.name,
      calories: input.calories,
      proteinG: input.proteinG,
      netCarbsG: input.netCarbsG,
      fatG: input.fatG,
      loggedAt: new Date(input.loggedAt),
    })
    // Scoped to userId too, not just id — a user can only ever edit their
    // own meals, even though there's one user today.
    .where(and(eq(meals.id, input.id), eq(meals.userId, userId)))

  revalidatePath('/tools/macros')
  revalidatePath('/tools/macros/history')
}

export async function deleteMeal(id: string): Promise<void> {
  const userId = await requireUserId()

  await db.delete(meals).where(and(eq(meals.id, id), eq(meals.userId, userId)))

  revalidatePath('/tools/macros')
  revalidatePath('/tools/macros/history')
}

export type MealRow = {
  id: string
  name: string
  calories: number
  proteinG: number
  netCarbsG: number
  fatG: number
  loggedAt: string
}

function toMealRow(row: typeof meals.$inferSelect): MealRow {
  return {
    id: row.id,
    name: row.name,
    calories: row.calories,
    proteinG: row.proteinG,
    netCarbsG: row.netCarbsG,
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
