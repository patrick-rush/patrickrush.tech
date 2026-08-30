import { z } from 'zod'

// The AI reports total carbs and fiber separately, rather than net carbs
// directly — net carbs (what actually matters for keto) is then computed
// in code as total - fiber, so the subtraction is always exact rather than
// left to the model.
export const MacroEstimateSchema = z.object({
  name: z
    .string()
    .describe(
      "Short human-readable label for the meal, e.g. 'Grilled chicken salad'",
    ),
  calories: z.number().nonnegative(),
  protein_g: z.number().nonnegative(),
  total_carbs_g: z.number().nonnegative(),
  fiber_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
})

export type MacroEstimate = z.infer<typeof MacroEstimateSchema>

// The resolved shape used everywhere downstream of the AI call — net carbs
// already computed, everything rounded to its display precision.
export type ResolvedMacros = {
  name: string
  calories: number
  proteinG: number
  netCarbsG: number
  fatG: number
}

function roundTo(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

export function resolveMacros(estimate: MacroEstimate): ResolvedMacros {
  const netCarbs = Math.max(0, estimate.total_carbs_g - estimate.fiber_g)
  return {
    name: estimate.name,
    calories: roundTo(estimate.calories, 10),
    proteinG: roundTo(estimate.protein_g, 1),
    // Finer precision on carbs specifically — whole-gram rounding alone
    // can account for a couple of the "phantom" carbs on a strict keto diet.
    netCarbsG: roundTo(netCarbs, 0.5),
    fatG: roundTo(estimate.fat_g, 1),
  }
}
