import { pgTable, text, integer, real, timestamp, uuid, unique } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const macroTargets = pgTable(
  'macro_targets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    calories: integer('calories').notNull(),
    proteinG: real('protein_g').notNull(),
    netCarbsG: real('net_carbs_g').notNull(),
    fatG: real('fat_g').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [unique('macro_targets_user_id_unique').on(table.userId)],
)
