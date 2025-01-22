import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/src/lib/prismadb';
import serverAuth from "@/src/lib/serverAuth";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);
    const { id, profileId } = req.query;

    if (typeof id !== 'string') {
      throw new Error('Invalid Id');
    }

    if (!id) {
      throw new Error('Missing Id');
    }

    let movie = await prismadb.movie.findUnique({
      where: {
        id: id
      },
      include: {
        watchProgresses: {
          // @ts-ignore
          where: { profileId: profileId },
        },
      }
    });
    // Get the user's current profile
    let favorite;
    if (profileId) {
      favorite = await prismadb.favorite.findFirst({
        where: {
          movieId: id,
          profileId: profileId as string
        }
      });
    }
 

    // Include isFavorite boolean in the response
    movie = {
      ...movie,
      // @ts-ignore
      isFavorite: !!favorite, // true if favorite exists, false otherwise
    };
    console.log("movie", movie);

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
