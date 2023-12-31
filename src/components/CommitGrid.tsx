"use client"
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import DateUtils from '@/lib/DateUtils'

interface Month {
  name: string;
  abbr: string;
  index: number;
  days: number;
  year: number;
  firstDay: number;
  daysIntoYear: number;
}

interface Contribution {
    date: string;
    source: string;
}

function CodeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
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
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
          className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
        />
      </svg>
    )
}

export const CommitGrid = () => {
    "use client"
    const [active, setActive] = useState<'all' | 'github' | 'gitlab'>('all')
    const [gitHubLoading, setGitHubLoading] = useState<boolean>(true)
    const [gitLabLoading, setGitLabLoading] = useState<boolean>(true)
    const [gitHubError, setGitHubError] = useState<boolean>(false)
    const [gitLabError, setGitLabError] = useState<boolean>(false)
    const months: Month[] = useMemo(() => DateUtils.generateMonths(), []) // Memoize months array
    const isLeapYear = months.find(month => month.name === "March")!.days === 29

    const fetchData = useCallback(async (apiEndpoint: string, setData: Dispatch<SetStateAction<Contribution[]>>) => {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            })

            if (response.status === 200) {
                const responseJson = await response.json()
                setData(responseJson.body)
            } else {
                const res = await response.text()
                console.log(res)
                throw Error("An error occurred while fetching commit data.")
            }
        } catch (err) {
            console.log("Error", err)
            throw err
        }
    }, [])

    const [gitLabData, setGitLabData] = useState<Contribution[]>([])
    const [gitHubData, setGitHubData] = useState<Contribution[]>([])

    useEffect(() => {
        fetchData('/api/get-gitlab-commits', setGitLabData).then(() => {
            setGitLabLoading(false)
        }).catch((err) => {
            setGitLabError(true)
            setGitLabLoading(false)
            console.log('Error:', err)
        })
    }, [fetchData])

    useEffect(() => {
        fetchData('/api/get-github-commits', setGitHubData).then(() => {
            setGitHubLoading(false)
        }).catch((err) => {
            setGitHubError(true)
            setGitHubLoading(false)
            console.log('Error:', err)
        })
    }, [fetchData])

    const daysIntoYear = useCallback((date: Date | string) => {
        if (typeof date === 'string') date = new Date(date)
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
    }, [])

    const dateFromDayOfYear = useCallback((dayOfYear: number, year?: number) => {
        const baseDate = new Date(year ?? new Date().getFullYear(), 0, 1)
        const targetDate = new Date(baseDate.getTime() + dayOfYear * 24 * 60 * 60 * 1000)
        
        return {
            year: targetDate.getFullYear(),
            month: targetDate.getMonth(),
            day: targetDate.getDate(),
        }
    }, [])

    const calculateContributions = useCallback((data: Contribution[]) => {
        const contributions: { [key: number]: Contribution[] | undefined } = {}
        data.forEach((entry) => {
            const dayOfYear = daysIntoYear(entry.date)
            if (contributions[dayOfYear]) contributions[dayOfYear]?.push(entry)
            else contributions[dayOfYear] = [entry]
        })
        return contributions
    }, [daysIntoYear])
        
    const gitHubContributions = useMemo(() => {
        return calculateContributions(gitHubData)
    }, [gitHubData, calculateContributions])
        
    const gitLabContributions = useMemo(() => {
        return calculateContributions(gitLabData)
    }, [gitLabData, calculateContributions])
        
    const allContributions = useMemo(() => {
        return calculateContributions([...gitHubData, ...gitLabData])
    }, [gitHubData, gitLabData, calculateContributions])

    let activeContributions: {
        [key: number]: Contribution[] | undefined
    }
    
    switch (active) {
        case 'github':
            activeContributions = gitHubContributions
            break
        case 'gitlab':
            activeContributions = gitLabContributions
            break
        default:
            activeContributions = allContributions
            break
    }

    const loadingStyles = 'animate-pulse bg-zinc-100 dark:bg-zinc-800'
    const blankStyles = 'bg-zinc-100 dark:bg-zinc-800'
    const filledStyles = 'bg-teal-500 dark:bg-teal-400'
    const hiddenStyles = 'bg-transparent'

    interface NavigationItemProps {
        onClick: () => void;
        active: boolean;
        error: boolean;
        label: string;
    }
    
    const renderNavigationItem = ({
        onClick,
        active,
        error,
        label,
    }: NavigationItemProps) => (
        <span
            title={error ? 'Error loading data' : ''}
            onClick={onClick}
            className={`cursor-pointer ${
            active
                ? error
                ? 'text-red-500 dark:text-red-400'
                : 'text-teal-500 dark:text-teal-400'
                : error
                ? 'text-zinc-800 transition hover:text-red-500 dark:text-zinc-200 dark:hover:text-red-500'
                : 'text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500'
            }`}
        >
            {label}
        </span>
    );

    const daysInGivenYear = isLeapYear ? 366 : 365
    const firstMonth = months[0]
    const currentMonth = months[11]

    return (
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <h2 className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <div className="flex">
                    <CodeIcon className="h-6 w-6 flex-none" />
                    <span className="ml-3">Commits</span>
                </div>
                <div className="flex justify-between space-x-3">
                    {renderNavigationItem({
                        onClick: () => setActive('all'),
                        active: active === 'all',
                        error: gitHubError && gitLabError,
                        label: 'All',
                    })}
                    {renderNavigationItem({
                        onClick: () => setActive('github'),
                        active: active === 'github',
                        error: gitHubError,
                        label: 'GitHub',
                    })}
                    {renderNavigationItem({
                        onClick: () => setActive('gitlab'),
                        active: active === 'gitlab',
                        error: gitLabError,
                        label: 'GitLab',
                    })}                
                </div>
            </h2>
            <div dir="rtl" className="flex justify-center">
                <div className="grid gap-[3px] overflow-x-scroll overflow-y-hidden">
                    <span dir="ltr" className="grid gap-[3px]">
                        {/* Month Header Row */}
                        <div className="grid-cols-12 w-[962px] grid gap-[3px]">
                            {months.map((month, index) => (
                                <div key={index} className="p-2 text-center text-zinc-600 dark:text-zinc-400 font-medium text-xs">
                                    {month.abbr}
                                </div>
                            ))}
                        </div>
                        {/* Grid Rows */}
                        {Array.from({ length: 7 }).map((_, rowIndex) => {
                            
                            return (
                                <div key={rowIndex} className="grid-cols-52 grid gap-[3px]">
                                    {Array.from({ length: 52 }).map((_, colIndex) => {

                                        let location = ((((colIndex * 7) + (rowIndex)) + (firstMonth.daysIntoYear - firstMonth.firstDay)) + 7) % daysInGivenYear
                                        if (location < 1) location = (daysInGivenYear + location) - 1

                                        const contributionsPerLocation = activeContributions[location]
                                        const numberOfCommits = contributionsPerLocation?.length || 0
                                        const dateOfLocation = dateFromDayOfYear(location)
                                        const isHidden = 
                                            (daysIntoYear(new Date()) < location
                                                && location < currentMonth.daysIntoYear + currentMonth.days)
                                            || colIndex === 0
                                                && dateOfLocation.month !== firstMonth.index
                                            || colIndex === 51
                                                && dateOfLocation.month !== currentMonth.index
                                        const loading = gitLabLoading || gitHubLoading

                                        return (
                                            <div
                                                title={isHidden ? '' : `Commits: ${numberOfCommits}`}
                                                key={location} id={"grid-square-" + location}
                                                className={`p-2 text-center rounded-sm ${loading ? loadingStyles : isHidden ? hiddenStyles : numberOfCommits ? filledStyles : blankStyles}`}
                                            ></div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}