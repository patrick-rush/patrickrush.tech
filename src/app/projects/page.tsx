import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import gameOfLifeLogo from '@/images/logos/game-of-life-logo.png'
import heartLogo from '@/images/logos/heart-logo.png'
import spadeLogo from '@/images/logos/spade-logo.png'
import prLogo from '@/images/logos/pr-logo.png'
import nz from '@/images/logos/new-zealand.png'

import clsx from 'clsx'
interface Project {
  name: string
  description: string
  link: {
    href: string
    label: string
  }
  logo: any
  logoShape?: 'circle' | 'square'
}

const projects: Project[] = [
  {
    name: 'Game Of Life',
    description:
      "A classic code challenge: Conway's Game of Life. Explore the beauty and intrigue of cellular automata with this interactive simulation. Built using Angular and vanilla CSS.",
    link: { href: './automata', label: 'patrickrush.tech/automata' },
    logo: gameOfLifeLogo,
    logoShape: 'square',
  },
  {
    name: 'Solitaire',
    description:
      'A classic card game for killing time. Click here to play, and check out the next project to view the source code.',
    link: { href: './solitaire', label: 'patrickrush.tech/solitaire' },
    logo: heartLogo,
  },
  {
    name: 'patrickrush.tech',
    description:
      'My portfolio page. Built on top of a beautiful Tailwind UI template, this Next.js website is always evolving with personal touches, articles, and projects.',
    link: {
      href: 'https://github.com/patrick-rush/patrickrush.tech',
      label: 'github.com',
    },
    logo: prLogo,
  },
  {
    name: 'NƎRTS',
    description:
      'Can you tell I like card games? This fast paced strategy game is a work in progress. Play with friends anywhere in the world and see who has the speed and skill to win.',
    link: {
      href: 'https://github.com/patrick-rush/nerts',
      label: 'github.com',
    },
    logo: spadeLogo,
    logoShape: 'square',
  },
  {
    name: 'New Zealand Ferns (Photography Project)',
    description:
      'A collection of photos and information about the native ferns of New Zealand. Website built using sambecker/exif-photo-blog Next.js template.',
    link: {
      href: 'https://newzealandferns.com',
      label: 'newzealandferns.com',
    },
    logo: nz,
    logoShape: 'square',
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of projects I have worked on over the years.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Some things I've made."
      intro="Here is a collection of projects that I have worked on over the years."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name}>
            <div
              className={clsx(
                'relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0',
                project.logoShape === 'square'
                  ? 'rounded-md'
                  : project.logoShape === 'circle'
                  ? 'rounded-full'
                  : 'rounded-full', // to allow for future shapes
              )}
            >
              <Image
                src={project.logo}
                alt=""
                className="h-8 w-8"
                unoptimized
              />
            </div>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href}>{project.name}</Card.Link>
            </h2>
            <Card.Description>{project.description}</Card.Description>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
