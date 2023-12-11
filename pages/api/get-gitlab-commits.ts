import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const GITLAB_PAT = process.env.GITLAB_PAT || '';
    const url = 'https://gitlab.com/api/v4/projects/41808127/repository/commits?all=true&author=' + encodeURIComponent('Patrick Rush') + '&since=' + getPastDate(1)
    console.log(url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': GITLAB_PAT,
                'Content-Type': 'application/json',
            }
        })
        const responseJson = await response.json()
        console.log("GitLab Response:", responseJson)
        return res.status(200).json({
            message: "Success",
            body: responseJson
        });
    } catch (err) {
        console.log("Error reaching GitLab:", err)
        return res.status(500).json({ message: err });
    }
}

const getPastDate = (subtrahend: number): string => {
    let date = new Date()
    date.setMonth(date.getMonth() - subtrahend)
    return date.toISOString()
}