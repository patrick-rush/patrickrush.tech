import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const GITHUB_PAT = process.env.GITHUB_PAT || '';
    const refDate = getPastDate(1)
    const octokit = new Octokit({
        auth: GITHUB_PAT
    })

    try {
        const accumulator: any[] = []
        const reposResponse = await octokit.request('GET /users/{username}/repos', {
            username: 'patrick-rush',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            per_page: 100,
            since: refDate,
            type: 'all',
        })
    
        const fetchCommits = async () => {
            await Promise.all(reposResponse.data.map(async entry => {
                let repoName = entry.name
                const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                    owner: 'patrick-rush',
                    repo: repoName,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    },
                    per_page: 100,
                    author: 'patrick-rush',
                    since: refDate,
                })
                const commits = response.data
                if (commits) accumulator.push(...commits)
            }))
        }
    
        await fetchCommits()

        const processedData = accumulator.map(commit => {
            return {
                date: commit.commit?.author?.date,
                source: "GitHub"
            }
        })
    
        return res.status(200).json({
            message: "Success",
            body: processedData
        });
    } catch (err) {
        console.log("Error reaching GitHub:", err)
        return res.status(500).json({ message: err });
    }
}

const getPastDate = (subtrahend: number): string => {
    let date = new Date()
    date.setMonth(date.getMonth() - subtrahend)
    return date.toISOString()
}