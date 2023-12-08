"use client"
import { type Metadata } from 'next'

import { SimpleLayout } from '@/components/SimpleLayout'
import { useSearchParams } from 'next/navigation'


export default function ThankYou() {
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
