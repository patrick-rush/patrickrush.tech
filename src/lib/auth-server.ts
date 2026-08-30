import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

// Server Actions are directly invokable by anyone who discovers their
// endpoint, so every action that touches data must re-check the real
// session — the middleware cookie check only gates page rendering.
export async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Not authenticated')
  return session.user.id
}
