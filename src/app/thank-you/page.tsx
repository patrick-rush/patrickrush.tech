"use client"
import { Suspense } from 'react'

import { SimpleLayout } from '@/components/SimpleLayout'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const name = searchParams?.get('name')
  const email = searchParams?.get('email')

  const title = "Hey, thanks for reaching out" + (name ? `, ${name}!` : "!")
  const intro = "I'll be in touch shortly" + (email ? ` at ${email}.` : ".")

  return (
    <SimpleLayout
      title={title}
      intro={intro}
    />
  )
}

export default function ThankYou() {
  return (
    <Suspense fallback={<SimpleLayout title="Hey, thanks for reaching out!" intro="I'll be in touch shortly." />}>
      <ThankYouContent />
    </Suspense>
  )
}
