import type { NextApiRequest, NextApiResponse } from "next";
import DateUtils from '@/lib/DateUtils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const GITLAB_PAT = process.env.GITLAB_PAT || '';

    try {
        const accumulator: any[] = []
        const fetchData = async (page: number = 1) => {

            const url = buildUrl({
                contributor: 'Patrick Rush',
                monthsBack: 12,
                page: page
            })

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'PRIVATE-TOKEN': GITLAB_PAT,
                    'Content-Type': 'application/json',
                }
            })

            const headers = response.headers
            const nextPage = headers.get("x-next-page")

            const responseJson = await response.json()
            accumulator.push(...responseJson)

            if (nextPage) await fetchData(+nextPage)
        }

        await fetchData()
        
        const processedData = accumulator.map(commit => {
            return {
                date: commit["committed_date"],
                source: "GitLab"
            }
        })

        return res.status(200).json({
            message: "Success",
            body: processedData
        });
    } catch (err) {
        console.log("Error reaching GitLab:", err)
        return res.status(500).json({ message: err });
    }
}

const buildUrl = ({ 
    contributor,
    monthsBack,
    perPage = 100,
    page = 0
}:{
    contributor: string,
    monthsBack: number,
    perPage?: number,
    page?: number
}) => {
    let url = 'https://gitlab.com/api/v4/projects/41808127/repository/commits?all=true&author=' + encodeURIComponent(contributor) + '&since=' + DateUtils.getPastDateString(monthsBack) + `&per_page=${perPage}`
    if (page) url += `&page=${page}`
    return url
}
