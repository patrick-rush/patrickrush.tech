import type { NextRequest } from "next/server";

export default async function handler(
// async function handler(
    req: NextRequest,
    // res: NextResponse
) {
    const CRON_SECRET = process.env.CRON_SECRET

    // if (req.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) {
    //     return new Response('Unauthorized', {
    //         status: 401
    //     })
    // } else {
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

            // we need to be able to store these values as secrets and not as env variables
            // consider integrating doppler as a secrets manager so that keys can be rotated
            // keys are currently incorrect because of last test, and will need to be updated
            
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
// }

const getFutureDate = (addend: number): string => {
    let date = new Date()
    date.setMonth(date.getMonth() + addend)
    return date.toISOString().substring(0, 10)
}