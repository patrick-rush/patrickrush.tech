import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Patrick Rush',
    default:
      'Patrick Rush - Software engineer, cellist, pilot, eternal student',
  },
  description:
    "I'm Patrick, a full-stack software engineer based in Richmond, VA.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
            <Analytics />
            <SpeedInsights />
          </div>
        </Providers>
      </body>
    </html>
  )
}
