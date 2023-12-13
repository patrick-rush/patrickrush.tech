"use client"
import { Button } from '@/components/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path
          d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
          className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
        />
        <path
          d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
          className="stroke-zinc-400 dark:stroke-zinc-500"
        />
      </svg>
    )
  }

export const Contact = () => {
    "use client"

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    const EMAIL_ADDRESS = process.env.NEXT_PUBLIC_EMAIL_ADDRESS

    const router = useRouter()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        
        try {
          const response = await fetch('/api/contact', {
              method: 'POST',
              body: JSON.stringify({
                  name,
                  email,
                  message
              }),
              headers: {
                  'content-type': 'application/json'
              }
          })

          if (response.status === 200) {
            router.push(`/thank-you?name=${encodeURI(name) || ""}&email=${encodeURI(email) || ""}`)
          } else {
            const res = await response.text()
            console.log(res)
            setError(true)
          }
        } catch (err) {
          console.log("Error", err)
        }
    }
  
    return error ? (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <MailIcon className="h-6 w-6 flex-none" />
          <span className="ml-3">That didn&apos;t seem to work...</span>
        </h2>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Let&apos;s try something else. Shoot me an email at <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}, and I&apos;ll get back with you soon!</a>
        </p>
      </div>
    ) : (
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
      >
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <MailIcon className="h-6 w-6 flex-none" />
          <span className="ml-3">Get in touch</span>
        </h2>
        <div className="mt-6 flex">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            required
            className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
          />
        </div>
        <div className="mt-6 flex">
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Your message"
            aria-label="Your message"
            required
            className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
          />
        </div>
        <div className="mt-6 flex">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            aria-label="Your email address"
            required
            className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
          />
          <Button type="submit" variant="secondary" className="ml-4 flex-none">
            Send
          </Button>
        </div>
      </form>
    )
  }