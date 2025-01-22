import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/src/lib/serverAuth";
import prismadb from '@/src/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        const { currentUser } = await serverAuth(req, res);

        const profiles = await prismadb.profile.findMany({
            where: {
                userId: currentUser.id,
            }
        });

        return res.status(200).json(profiles);
    } catch (error) {
        console.log({ error })
        return res.status(500).end();
    }
}