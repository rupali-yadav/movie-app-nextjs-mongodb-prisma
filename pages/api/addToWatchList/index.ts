import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/src/lib/prismadb';
import serverAuth from "@/src/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await serverAuth(req, res);

        const { profileId, movieId } = req.body;

        if (req.method === 'POST') {
            const existingFavorite = await prismadb.favorite.findUnique({
                where: {
                    profileId_movieId: { profileId, movieId }
                }
            });

            if (existingFavorite) {
                return res.status(400).json({ error: 'Movie is already in the list' });
            }

            const newFavorite = await prismadb.favorite.create({
                data: {
                    profileId,
                    movieId,
                },
            });

            return res.status(200).json(newFavorite);
        } else if (req.method === 'DELETE') {
            await prismadb.favorite.deleteMany({
                where: {
                    profileId,
                    movieId,
                },
            });

            return res.status(200).json({ message: 'success' });
        } else {
            return res.status(405).end();
        }

    } catch (error) {
        console.log({ error });
        return res.status(500).json({ error: 'Internal server error' });
    }
}
