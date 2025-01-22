
import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/src/lib/serverAuth";
import prismadb from '@/src/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end();
        }

        const { currentUser } = await serverAuth(req, res);
        const { name, image } = req.body;

        const newProfile = await prismadb.profile.create({
            data: {
                name,
                image,
                userId: currentUser.id
            }
        });

        return res.status(200).json(newProfile);
    } catch (error) {
        console.log({ error })
        return res.status(500).end();
    }
}