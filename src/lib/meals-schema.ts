import { z } from 'zod'

export const MacroEstimateSchema = z.object({
  name: z
    .string()
    .describe(
      "Short human-readable label for the meal, e.g. 'Grilled chicken salad'",
    ),
  calories: z.number().int().nonnegative(),
  protein_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
})

export type MacroEstimate = z.infer<typeof MacroEstimateSchema>
