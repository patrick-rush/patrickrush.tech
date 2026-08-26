import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/client'

export const auth = betterAuth({
  // No static baseURL: better-auth resolves it per-request from
  // x-forwarded-host/proto, so this works unmodified on localhost,
  // every Vercel preview URL, and production.
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: {
    enabled: true,
  },
})
