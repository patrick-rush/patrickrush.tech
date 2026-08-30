// One-off script to provision the single account for /tools. There is no
// public sign-up route by design — run this once per environment:
//   npm run create-user -- --email you@example.com --password 'xxx' --name 'Your Name'
import { auth } from '@/lib/auth'

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function main() {
  const email = getArg('--email')
  const password = getArg('--password')
  const name = getArg('--name') ?? 'Patrick Rush'

  if (!email || !password) {
    console.error(
      'Usage: npm run create-user -- --email you@example.com --password xxx [--name "Your Name"]',
    )
    process.exit(1)
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  })

  console.log('Created user:', result.user.id, result.user.email)
}

main().catch((err) => {
  console.error('Failed to create user:', err)
  process.exit(1)
})
