import type { NextRequest } from "next/server";

/**
 * 
 * To reintegrate this cron job, add the following lines to ~/vercel.json
 * This will rotate the secret value stored in the environment once a week, at 12 AM on Sunday
 *
 * {
 *     "crons": [{
 *         "path": "/api/cron",
 *         "schedule": "0 0 * * 0"
 *     }]
 * }
 * 
 * You will also need to add the environment variable GITLAB_PAT_ID to the ENV
 * 
 * Note: commented out lines below can be used for testing locally.
 *  To run locally, set up a runner function and run the function from the CL
 *  or go to http://localhost:3000/api/cron in the browser 
 */

export default async function handler(
// async function handler(
    req: NextRequest,
    // res: NextResponse
) {

    // Remove to reinstate
    return new Response('Out Of Service', {
        status: 500
    })

    const CRON_SECRET = process.env.CRON_SECRET

    // The if and associated brackets should be commented out when running locally
    if (req.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401
        })
    } else {
        const GITLAB_PAT = process.env.GITLAB_PAT || '';
        const GITLAB_PAT_ID = process.env.GITLAB_PAT_ID || '';
        const url = `https://gitlab.com/api/v4/personal_access_tokens/${GITLAB_PAT_ID}/rotate?expires_at=${getFutureDate(1)}`
        // const url = `https://gitlab.com/api/v4/personal_access_tokens`

        try {
            const result = await fetch(url, {
                method: 'POST',
                // method: 'GET',
                headers: {
                    'PRIVATE-TOKEN': GITLAB_PAT,
                    'Content-Type': 'application/json',
                }
            })

            const responseJson = await result.json()

            process.env.GITLAB_PAT = responseJson.token
            process.env.GITLAB_PAT_ID = responseJson.id

            console.log(">>>", responseJson)
            console.log(">>>", GITLAB_PAT)
            console.log(">>>", GITLAB_PAT_ID)

            return new Response('Success', {
                status: 200
            })
            // return res.json()
        } catch (err) {
            console.log("Error reaching GitLab:", err)
            return new Response('Internal Server Error', {
                status: 500
            })
        }
    }
}

const getFutureDate = (addend: number): string => {
// const getFutureDate = (addend) => { // To run without TS when running from CLI
    let date = new Date()
    date.setMonth(date.getMonth() + addend)
    return date.toISOString().substring(0, 10)
}