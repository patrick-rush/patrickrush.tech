import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// HTTP driver (not a pooled TCP connection) — the right fit for Vercel's
// serverless functions, which can't hold a long-lived pg Pool across
// invocations.
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
