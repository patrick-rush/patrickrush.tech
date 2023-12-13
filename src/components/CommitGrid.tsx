"use client"
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import type { Dispatch, SetStateAction} from 'react'

interface Month {
  name: string;
  abbr: string;
  days: number;
  year: number;
  firstDay: number;
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

function generateMonths(): Month[] {
    const months: Month[] = [];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = new Date().getMonth();
    const orderedMonths = [...monthNames.slice(currentMonth + 1), ...monthNames.slice(0, currentMonth + 1)]

    const getPastDate = (subtrahend: number): Date => {
        let date = new Date()
        date.setMonth(date.getMonth() - subtrahend)
        return date
    }

    for (let i = 0; i < 12; i++) {
        const monthName = orderedMonths[i];
        const monthAbbr = monthName.slice(0, 3);
        const monthIndex = monthNames.findIndex(entry => entry === monthName)
        const yearOfMonth = getPastDate(11 - i).getFullYear()
        const daysInMonth = new Date(yearOfMonth, monthIndex, 0).getDate();
        const firstDayOfMonth = new Date(yearOfMonth, monthIndex, 1).getDay()

        months.push({ name: monthName, abbr: monthAbbr, days: daysInMonth, year: yearOfMonth, firstDay: firstDayOfMonth });
    }

    return months;
};

export const CommitGrid = () => {
    "use client"
    const [active, setActive] = useState<'all' | 'github' | 'gitlab'>('all')
    const [gitHubLoading, setGitHubLoading] = useState<boolean>(true)
    const [gitLabLoading, setGitLabLoading] = useState<boolean>(true)
    const months: Month[] = useMemo(() => generateMonths(), []); // Memoize months array

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
            }
        } catch (err) {
            console.log("Error", err)
        }
    }, []);

    const [gitLabData, setGitLabData] = useState<Contribution[]>([]);
    const [gitHubData, setGitHubData] = useState<Contribution[]>([]);

    useEffect(() => {
        fetchData('/api/get-gitlab-commits', setGitLabData).then(() => {
            setGitLabLoading(false)
        });
    }, [fetchData]);

    useEffect(() => {
        fetchData('/api/get-github-commits', setGitHubData).then(() => {
            setGitHubLoading(false)
        });
    }, [fetchData]);

    const daysIntoYear = useCallback((date: Date | string) => {
        if (typeof date === 'string') date = new Date(date)
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    }, []);

    const gitHubContributions = useMemo(() => {
        const contributions: { [key: number]: Contribution[] | undefined } = {};
        gitHubData.forEach(entry => {
            const dayOfYear = daysIntoYear(entry.date);
            if (contributions[dayOfYear]) contributions[dayOfYear]?.push(entry);
            else contributions[dayOfYear] = [entry];
        });
        return contributions;
    }, [gitHubData, daysIntoYear]);

    const gitLabContributions = useMemo(() => {
        const contributions: { [key: number]: Contribution[] | undefined } = {};
        gitLabData.forEach(entry => {
            const dayOfYear = daysIntoYear(entry.date);
            if (contributions[dayOfYear]) contributions[dayOfYear]?.push(entry);
            else contributions[dayOfYear] = [entry];
        });
        return contributions;
    }, [gitLabData, daysIntoYear]);

    const allContributions = useMemo(() => {
        const contributions: { [key: number]: Contribution[] | undefined } = {};
        [...gitHubData, ...gitLabData].forEach(entry => {
            const dayOfYear = daysIntoYear(entry.date);
            if (contributions[dayOfYear]) contributions[dayOfYear]?.push(entry);
            else contributions[dayOfYear] = [entry];
        });
        return contributions;
    }, [gitHubData, gitLabData, daysIntoYear]);

    return (
        <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
            <h2 className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <div className="flex">
                    <CodeIcon className="h-6 w-6 flex-none" />
                    <span className="ml-3">Commits</span>
                </div>
                <div className="flex justify-between space-x-3">
                    <span onClick={() => setActive('all')}
                    className={`cursor-pointer ${active === 'all' ? "text-teal-500 dark:text-teal-400" : "text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"}`}>All</span>
                    <span onClick={() => setActive('github')} className={`cursor-pointer ${active === 'github' ? "text-teal-500 dark:text-teal-400" : "text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"}`}>GitHub</span>
                    <span onClick={() => setActive('gitlab')} className={`cursor-pointer ${active === 'gitlab' ? "text-teal-500 dark:text-teal-400" : "text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"}`}>GitLab</span>
                </div>
            </h2>
            <div className="flex justify-center direction-rtl">
                <div className="grid gap-[3px] overflow-x-scroll overflow-y-hidden md:overflow-hidden">
                    {/* Month Header Row */}
                    <div className="grid-cols-12 w-[962px] grid gap-[3px]">
                        {months.map((month, index) => (
                            <div key={index} className="p-2 text-center text-zinc-600 dark:text-zinc-400 font-medium text-xs">
                                {month.abbr}
                            </div>
                        ))}
                    </div>
                    {/* Grid Rows */}
                    {Array.from({ length: 7 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid-cols-52 grid gap-[3px]">
                        {Array.from({ length: 52 }).map((_, colIndex) => {

                            const location = ((colIndex * 7) + (rowIndex + 1)) - months[0].firstDay
                            
                            let activeContributions
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

                            const contributionsPerLocation = activeContributions[location]
                            const numberOfCommits = contributionsPerLocation?.length || 0
                            const isHidden = location < 0 || location > daysIntoYear(new Date())
                            const loading = gitLabLoading || gitHubLoading

                            const loadingStyles = 'animate-pulse bg-zinc-100 dark:bg-zinc-800'
                            const blankStyles = 'bg-zinc-100 dark:bg-zinc-800'
                            const filledStyles = 'bg-teal-500 dark:bg-teal-400'
                            const hiddenStyles = 'bg-transparent'
                            
                            return (
                                <div title={`Commits: ${numberOfCommits}`} key={colIndex} id={"grid-square-" + location} className={`p-2 text-center rounded-sm ${loading ? loadingStyles : isHidden ? hiddenStyles : numberOfCommits ? filledStyles : blankStyles}`}>
                                </div>
                            )})}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};