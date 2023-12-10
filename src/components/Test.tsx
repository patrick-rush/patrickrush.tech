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

export const Test = () => {
    "use client"

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        
        try {
          const response = await fetch('/api/get-gitlab-commits', {
              method: 'GET',
              headers: {
                  'content-type': 'application/json'
              }
          })
    
          if (response.status === 200) {
            console.log("response", response)
          } else {
            const res = await response.text()
            console.log(res)
          }
        } catch (err) {
          console.log("Error", err)
        }
    }

    return (
        <form onSubmit={onSubmit} className="hidden">
            <Button type="submit" className="ml-4 flex-none">
                TEST
            </Button>
        </form>
    )
  }