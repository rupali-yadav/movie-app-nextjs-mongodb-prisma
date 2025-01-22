import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/src/lib/prismadb';
import serverAuth from "@/src/lib/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        await serverAuth(req, res);

        const { profileId } = req.query;
        const watchProgresses = await prismadb.watchProgress.findMany({
            // select all watchProgresses that match this profile id and 
            // select those where progress is a truthy value
            where: {
                profileId: profileId as string,
            },
            select: {
                // return all those props that we mention here
                progress: true,
                movie: true
            }
        });

        return res.status(200).json(watchProgresses);
    } catch (error) {
        console.log({ error })
        return res.status(500).end();
    }
}