import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import serverAuth from '@/src/lib/serverAuth';
import prismadb from '@/src/lib/prismadb';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { currentUser } = await serverAuth(req, res);

  if (!currentUser?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { movieId, progress, profileId } = req.body;

  if (!movieId || progress === undefined) {
    return res.status(400).json({ message: 'Bad request' });
  }




  const userId = currentUser?.id;

  // Check if a WatchProgress already exists for this profile and movie
  const existingWatchProgress = await prismadb.watchProgress.findUnique({
    where: {
      profileId_movieId: { profileId, movieId }
    }
  });

  try {

    if (existingWatchProgress) {
      // If it exists, update the progress
      const updatedWatchProgress = await prismadb.watchProgress.update({
          where: {
              id: existingWatchProgress.id,
          },
          data: {
              progress,
          },
      });

      return res.status(200).json(updatedWatchProgress);
  } else {
      // If it doesn't exist, create a new WatchProgress entry
      const newWatchProgress = await prismadb.watchProgress.create({
          data: {
              profileId,
              movieId,
              progress,
              userId: userId, // Assuming user is available in the request
          },
      });

      return res.status(200).json(newWatchProgress);
  }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};