import { pgTable, text, integer, real, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const meals = pgTable(
  'meals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    rawInput: text('raw_input').notNull(),
    name: text('name').notNull(),
    calories: integer('calories').notNull(),
    proteinG: real('protein_g').notNull(),
    carbsG: real('carbs_g').notNull(),
    fatG: real('fat_g').notNull(),
    loggedAt: timestamp('logged_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('meals_user_logged_at_idx').on(table.userId, table.loggedAt)],
)
