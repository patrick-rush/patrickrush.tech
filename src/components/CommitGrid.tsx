// import React from 'react';

// interface Contribution {
//   date: string;
//   level: number;
//   tooltipId: string;
//   // Add other properties as needed
// }

// // interface LegendItem {
// //   level: number;
// //   label: string;
// //   // Add other properties as needed
// // }

interface Month {
  name: string;
  abbr: string;
  days: number;
  // Add other properties as needed
}


interface Contribution {
    date: string;
    level: number;
    source: string;
}

// interface Props {
//   // Add props as needed
// }

// interface Month {
//     name: string;
//     abbr: string;
//     days: number;
//   }
  
  const generateMonths = (): Month[] => {
    const months: Month[] = [];
  
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = new Date().getMonth();
    const orderedMonths = [...monthNames.slice(currentMonth + 1), ...monthNames.slice(0, currentMonth + 1)]
  
    for (let i = 0; i < 12; i++) {
      const monthName = orderedMonths[i];
      const monthAbbr = monthName.slice(0, 3);
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, i + 1, 0).getDate();
  
      months.push({ name: monthName, abbr: monthAbbr, days: daysInMonth });
    }
  
    return months;
  };
  
//   // Example usage
//   const months: Month[] = generateMonths();
//   const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
//   // Now you can use `months` and `daysOfWeek` in your component

// const GitHubContributionGraph: React.FC<Props> = (props) => {
// "use client"
//   // Replace the following sample data with your actual data
//   const months: Month[] = generateMonths()
//   const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const contributions: Contribution[] = [
//     {
//       "date": "2023-11-13T00:11:22.000+00:00",
//       "level": 1,
//       "tooltipId": "1"
//     },
//     {
//       "date": "2023-11-13T00:12:09.000+00:00",
//       "level": 1,
//       "tooltipId": "1"
//     },
//     {
//       "date": "2023-11-15T03:44:57.000+00:00",
//       "level": 1,
//       "tooltipId": "1"
//     },
//     {
//       "date": "2023-11-15T03:48:42.000+00:00",
//       "level": 1,
//       "tooltipId": "1"
//     },
//     {
//       "date": "2023-11-15T04:09:42.000+00:00",
//       "level": 1,
//       "tooltipId": "1"
//     }
//   ];
// //   const legend: LegendItem[] = [...];

//   return (
//     <div className="border py-2 graph-before-activity-overview">
//       <div
//         className="js-calendar-graph mx-2 md:mx-3 flex flex-col items-end xl:items-center overflow-hidden pt-1 is-graph-loading graph-canvas ContributionCalendar h-full text-center"
//         // data-graph-url="/users/patrick-rush/contributions"
//         // data-url="/patrick-rush"
//         // data-from="2022-12-04 00:00:00 -0500"
//         // data-to="2023-12-10 23:59:59 -0500"
//         // data-org=""
//       >
//         <div className="max-w-full overflow-y-hidden overflow-x-auto">
//           <caption className="sr-only">Contribution Graph</caption>

//           <thead className="grid grid-cols-12">
//             <tr className="h-13">
//               <td className="w-28">
//                 <span className="sr-only">Day of Week</span>
//               </td>

//               {/* Repeat the following block for each month */}
//               {months.map((month, index) => (
//                 <th
//                   key={index}
//                   className="flex items-center justify-center h-10 relative flex-shrink-0"
//                   colSpan={month.days}
//                 >
//                   <span className="sr-only">{month.name}</span>
//                   <span className="absolute top-0">{month.abbr}</span>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {/* Repeat the following block for each day of the week */}
//             {daysOfWeek.map((day, dayIndex) => (
//               <tr key={day} className="h-10">
//                 <td className="ContributionCalendar-label" style={{ position: 'relative' }}>
//                   <span className="sr-only">{day}</span>
//                   <span className="absolute clip-path-circle bottom-[-3px]">{day.slice(0, 3)}</span>
//                 </td>

//                 {/* Repeat the following block for each day in the month */}
//                 {contributions.map((contribution, contributionIndex) => (
//                   <td
//                     key={contributionIndex}
//                     tabIndex={-1}
//                     data-ix={contributionIndex}
//                     aria-selected="false"
//                     aria-describedby={`contribution-graph-legend-level-${contribution.level}`}
//                     style={{ width: '10px' }}
//                     data-date={contribution.date}
//                     id={`contribution-day-component-${dayIndex}-${contributionIndex}`}
//                     data-level={contribution.level}
//                     role="gridcell"
//                     className={`w-10 h-10 rounded-sm bg-gray-300 bg-level-${contribution.level}`}
//                     aria-labelledby={`tooltip-${contribution.tooltipId}`}
//                   ></td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </div>

//         {/* <div className="width-full f6 px-0 px-md-5 py-1">
//           <div className="float-left">
//             <a href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile" className="Link--muted">
//               Learn how we count contributions
//             </a>
//           </div>

//           <div className="float-right color-fg-muted d-flex flex-items-center">
//             <span data-view-component="true" className="mr-1">
//               Less
//             </span>
//             {legend.map((legendItem, index) => (
//               <div
//                 key={index}
//                 style={{ width: '10px', height: '10px' }}
//                 id={`contribution-graph-legend-level-${legendItem.level}`}
//                 data-level={legendItem.level}
//                 data-view-component="true"
//                 className={`ContributionCalendar-day rounded-1 mr-1 bg-level-${legendItem.level}`}
//               >
//                 <span className="sr-only">{legendItem.label}</span>
//               </div>
//             ))}
//             <span data-view-component="true">More</span>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default GitHubContributionGraph;

import React from 'react';

function daysIntoYear(date: Date | string){
    if (typeof date === 'string') date = new Date(date)
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

/**
 * we have an array of dates
 * we are generating all of the dates for the last year in a grid that represents each week
 * 
 * as we are rending the grid, we need to check to see if that date is in the list of existing dates, and retrieve it
 * 
 * each date that we get back from github and gitlab should be placed into the slot corresponding with their date's day-of-the-year
 * 
 * we will only ever be getting commits back one year, so there won't be overlap (presumably)
 * though there could be entries from gitlab and github for the same day, so the entries for each day needs to be an array, and will take everything in the array 
 * 
 * to calculate what day of the year the grid cell represents, 
 */

const GitHubContributionGraph = () => {
    const months: Month[] = generateMonths()

    // const contributions: any = {
    //     1: [],
    //     2: [],
    //     3: [
    //         {
    //             date: "2023-01-03T05:00:00.000Z",
    //             level: 3,
    //             source: "GitLab"
    //         }
    //     ],
    //     54: [
    //         {
    //             date: "2023-01-03T05:00:00.000Z",
    //             level: 3,
    //             source: "GitLab"
    //         }
    //     ]
    // }

    const data = [
        {
          "date": "2023-10-16T00:11:22.000+00:00",
          "level": 1,
          "source": "GitHub"
        },
        {
          "date": "2023-10-13T00:11:22.000+00:00",
          "level": 1,
          "source": "GitLab"
        },
        {
          "date": "2023-11-13T00:11:22.000+00:00",
          "level": 1,
          "source": "GitLab"
        },
        {
          "date": "2023-11-13T00:12:09.000+00:00",
          "level": 1,
          "source": "GitLab"
        },
        {
          "date": "2023-11-15T03:44:57.000+00:00",
          "level": 1,
          "source": "GitHub"
        },
        {
          "date": "2023-11-15T03:48:42.000+00:00",
          "level": 1,
          "source": "GitLab"
        },
        {
          "date": "2023-11-15T04:09:42.000+00:00",
          "level": 1,
          "source": "GitLab"
        }
      ]

    let contributions: {
        [key: number]: Contribution[] | undefined
    } = {}
    data.forEach(entry => {
        const dayOfYear = daysIntoYear(entry.date)
        if (contributions[dayOfYear]) {
            contributions[dayOfYear]?.push(entry)
        } else {
            contributions[dayOfYear] = [entry]
        }
    })

    const gitHubColor = '#2981f4'
    const gitLabColor = '#e4432b'
    const theme = {
        'GitHub': '#1d863d',
        'GitLab': '#e4432b'
    }

    return (
        <div className="flex justify-center">
            <div className="grid gap-[3px] overflow-hidden">
                {/* Header Row */}
                <div className="grid-cols-12 w-[985px] grid gap-[3px]">
                    {months.map((month, index) => (
                        <div key={index} className="p-2 text-center text-zinc-600 dark:text-zinc-400 font-semibold">
                            {month.abbr}
                        </div>
                    ))}
                </div>
                {/* Grid Rows */}
                {
                    /* 
                    0, 0 = 1
                    0, 1 = 7
                    0, 2 = 14
                    ...
                    1, 0 = 2
                    1, 1 = 8
                    1, 2 = 15
                    ...

                    (colIndex * 7) + (rowIndex + 1)
                    (colIndex * 7) + (rowIndex + 1)
                    */
                }
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid-cols-52 grid gap-[3px]">
                    {Array.from({ length: 52 }).map((_, colIndex) => {
                        const location = (colIndex * 7) + (rowIndex + 1)
                        const contributionsPerLocation = contributions[location]
                        return (
                            <div key={colIndex} id={location.toString()} className="flex justify-between text-center rounded-sm overflow-hidden">
                                {contributionsPerLocation?.length ? contributionsPerLocation?.map((cont, contIndex) => (
                                    <div key={contIndex} className={`p-2 w-full h-full text-center bg-[${theme[cont?.source as keyof typeof theme]}] dark:bg-[${theme[cont?.source  as keyof typeof theme]}]`}></div>
                                )) : <div className="p-2 w-full h-full text-center bg-zinc-100 dark:bg-zinc-800"></div>}
                            </div>
                    )})}
                    </div>
                ))}
            </div>
        </div>
    );
};
// `p-2 text-center rounded-sm ${contributionsPerLocation?.length ? `bg-[${gitLabColor}] dark:bg-[${theme[contributionsPerLocation?.source || "default"]}]` : "bg-zinc-100 dark:bg-zinc-800"}`
export default GitHubContributionGraph;

// const generateBackground = (contributions: Contribution[]) => {
//     let includesGitHub
//     let includesGitLab

//     for (let cont of contributions) {
//         if (cont.source === 'GitHub') includesGitHub = true;
//         if (cont.source === 'GitLab') includesGitLab = true;
//         if (includesGitHub && includesGitLab) break
//     }
//     switch (contributions.length) {
//         case 0:

//         default:
//     }
// }