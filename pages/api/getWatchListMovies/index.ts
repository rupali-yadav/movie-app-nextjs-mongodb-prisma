import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/src/lib/serverAuth";
import prismadb from '@/src/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        await serverAuth(req, res);

        const { profileId } = req.query;

        const movies = await prismadb.favorite.findMany({
            where: {
                profileId: profileId as string,
            },
            select: {
                // return all those props that we mention here
                movie: true
            }
        });

        return res.status(200).json(movies);
    } catch (error) {
        console.log({ error })
        return res.status(500).end();
    }
}