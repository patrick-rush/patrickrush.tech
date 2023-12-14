"use client"
import { Button } from '@/components/Button'
import { useState } from 'react'

interface Role {
    company: string
    title: string
    // logo: ImageProps['src']
    start: string | { label: string; dateTime: string }
    end: string | { label: string; dateTime: string }
  }
  
  interface Skill {
    name: string
    level: string
    start: string
    end: string
    durationOverride?: string
  }

  function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
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
          d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
          className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
        />
        <path
          d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
          className="stroke-zinc-400 dark:stroke-zinc-500"
        />
      </svg>
    )
  }

  function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500 transition group-hover:fill-cyan-500 group-hover:dark:fill-cyan-400 group-hover:stroke-cyan-500 group-hover:dark:stroke-cyan-400"
            />
        </svg>
    )
  }
  
  function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
        <path
          d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }  
  
  function Role({ role }: { role: Role }) {
    let startLabel =
      typeof role.start === 'string' ? role.start : role.start.label
    let startDate =
      typeof role.start === 'string' ? role.start : role.start.dateTime
  
    let endLabel = typeof role.end === 'string' ? role.end : role.end.label
    let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime
  
    return (
      <li className="flex gap-4">
        {/* <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
          <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
        </div> */}
        <dl className="flex flex-auto flex-wrap gap-x-2">
          <dt className="sr-only">Company</dt>
          <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {role.company}
          </dd>
          <dt className="sr-only">Role</dt>
          <dd className="text-xs text-zinc-500 dark:text-zinc-400">
            {role.title}
          </dd>
          <dt className="sr-only">Date</dt>
          <dd
            className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
            aria-label={`${startLabel} until ${endLabel}`}
          >
            <time dateTime={startDate}>{startLabel}</time>{' '}
            <span aria-hidden="true">—</span>{' '}
            <time dateTime={endDate}>{endLabel}</time>
          </dd>
        </dl>
      </li>
    )
  }
  
  function Skill({ skill }: { skill: Skill }) {
    let duration = skill.durationOverride ?? new Date(skill.end).getFullYear() - new Date(skill.start).getFullYear()
  
    if (+duration < 1) {
      duration = '<1 year'
    } else if (+duration === 1) {
      duration = `>${duration} year`
    } else {
      duration = `>${duration} years`
    }
  
    return (
      <li className="flex gap-4">
        {/* <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
          <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
        </div> */}
        <dl className="flex flex-auto flex-wrap gap-x-2">
          <dt className="sr-only">Skill</dt>
          <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {skill.name}
          </dd>
          <dt className="sr-only">Level</dt>
          <dd className="text-xs text-zinc-500 dark:text-zinc-400">
            {skill.level}
          </dd>
          <dt className="sr-only">Duration</dt>
          <dd
            className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
            aria-label={duration}
          >
            <time dateTime={duration}>{duration}</time>
          </dd>
        </dl>
      </li>
    )
  }
  
  function Work() {
    let workHistory: Array<Role> = [
      {
        company: 'Uplynx',
        title: 'Principle Engineer/Co-Founder',
        // logo: logoPlanetaria,
        start: '2022',
        end: {
          label: 'Present',
          dateTime: new Date().getFullYear().toString(),
        },
      },
      {
        company: 'Jackson Symphony',
        title: 'Cellist',
        // logo: logoPlanetaria,
        start: '2015',
        end: {
          label: 'Present',
          dateTime: new Date().getFullYear().toString(),
        },
      },
      {
        company: 'Paymerang',
        title: 'Software Engineer III',
        // logo: logoPlanetaria,
        start: '2021',
        end: '2023'
      },
      {
        company: "Blanchard's Coffee",
        title: 'Web Sales Fulfillment Lead',
        // logo: logoStarbucks,
        start: '2017',
        end: '2021'
      },
    ]
  
    return (
      <ol className="mt-6 space-y-4 max-h-44 overflow-scroll">
        {workHistory.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
    )
  }
  
  function Skills() {
    let skills: Array<Skill> = [
      {
        name: 'JavaScript/TypeScript',
        level: 'Advanced',
        start: '2020',
        end: new Date().getFullYear().toString()
      },
      {
        name: 'C#/.NET',
        level: 'Beginner',
        start: '2023',
        end: new Date().getFullYear().toString()
      },
      {
        name: 'AWS/Serverless',
        level: 'Advanced',
        start: '2021',
        end: new Date().getFullYear().toString()
      },
      {
        name: 'React',
        level: 'Advanced',
        start: '2020',
        end: new Date().getFullYear().toString()
      },
      {
        name: 'SQL',
        level: 'Advanced Beginner',
        start: '2020',
        end: new Date().getFullYear().toString()
      },
      {
        name: 'Ruby/Rails',
        level: 'Intermediate',
        start: '2020',
        end: '2021'
      },
      {
        name: 'HTML/CSS',
        level: 'Intermediate',
        start: '2020',
        end: new Date().getFullYear().toString()
      },
    ]
  
    return (
      <ol className="mt-6 space-y-4 max-h-44 overflow-scroll">
        {skills.map((skill, skillIndex) => (
          <Skill key={skillIndex} skill={skill} />
        ))}
      </ol>
    )
  }
  
  export const Resume = () => {
    "use client"
    const [activeElement, setActiveElement] = useState(0)
    const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL || "/not-found"
  
    interface ResumeSection {
      title: string
      component: JSX.Element
    }
  
    const sections: ResumeSection[] = [
      {
        title: 'Work',
        component: <Work />
      },
      {
        title: 'Skills',
        component: <Skills />
      },
    ]
  
    return (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 flex flex-col">
        <h2 className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center">
                <BriefcaseIcon className="h-6 w-6 flex-none" />
                <span className="ml-3">{sections[activeElement].title}</span>
            </div>
            <div className="">
                <ArrowIcon className="h-6 w-6 flex-none cursor-pointer group" onClick={() => setActiveElement((activeElement + 1)%sections.length)}/>
            </div>
        </h2>
        <div className="flex-grow">
          {sections[activeElement].component}
        </div>
        <Button href={RESUME_URL} variant="secondary" className="group mt-6 w-full">
          Download Resume
          <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
        </Button>
      </div>
    )
  }
  