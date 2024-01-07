import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpeg'
import { PlayingCard } from '@/components/PlayingCard'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    "I'm Patrick Rush. Software engineer and cellist living in Richmond, VA.",
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Hi! I&apos;m Patrick Rush 👋🏼
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              As a full-stack software engineer, I draw inspiration from a diverse background that includes classical music and the coffee industry. 
            </p>
            <p>
              Transitioning to tech in 2020 allowed me to blend creativity, intelligence, and a love for learning into my professional journey. My approach to coding mirrors my musical roots - I aim for beauty in every line, crafting code that is not only effective but also a joy to behold - hopefully leaving things more beautiful than I found them wherever I go. 
            </p>
            <p>
              Constantly evolving, I bring the mindset of a lifelong student to each project. My ability to rapidly grasp new patterns and my dedication to continuous practice have propelled me to a mid-level engineering position within my first few years in the industry.
            </p>
            <p>
              In addition to my technical skill, I&apos;m a musician, a pilot, a knitter, a yogi, and a cyclist. These diverse interests shape my character, influencing my work with qualities like integrity, kindness, drive, and a meticulous attention to detail. Whether navigating the skies or weaving intricate patterns with code, I am the same person – passionate, professional, and fascinated by the world around me. Join me on this journey where software engineering meets artistry, and let&apos;s create something beautiful together.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href={`${process.env.TWITTER_URL}`} icon={TwitterIcon}>
              Follow on Twitter
            </SocialLink>
            <SocialLink href={`${process.env.INSTAGRAM_URL}`} icon={InstagramIcon} className="mt-4">
              Follow on Instagram
            </SocialLink>
            <SocialLink href={`${process.env.GITHUB_URL}`} icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href={`${process.env.LINKEDIN_URL}`} icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href={`${process.env.NEXT_PUBLIC_EMAIL_ADDRESS}`}
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              {process.env.NEXT_PUBLIC_EMAIL_ADDRESS}
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}