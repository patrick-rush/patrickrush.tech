import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Container } from '@/components/Container'

// Real session check (defense-in-depth behind middleware's cheap cookie
// check, which only gates whether this layout renders at all).
export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  return (
    <Container className="mt-16 sm:mt-32">
      <nav className="mb-10 flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <Link href="/tools" className="hover:text-teal-500">
          Tools
        </Link>
        <Link href="/tools/macros" className="hover:text-teal-500">
          Macros
        </Link>
      </nav>
      {children}
    </Container>
  )
}
