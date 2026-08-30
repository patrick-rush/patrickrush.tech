import { createAuthClient } from 'better-auth/react'

// No baseURL: falls back to window.location.origin (same-origin) — right
// for a single Next.js app on any host.
export const authClient = createAuthClient()

// Deliberately not exporting `signUp` — this site has exactly one account,
// provisioned via `npm run create-user`, and no public registration path.
export const { signIn, signOut, useSession } = authClient
