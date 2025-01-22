import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import useMovie from '@/hooks/useMovie';
import { useRouter } from 'next/router';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useProfile } from '@/src/context/profileContext';
import { convertTimeToSeconds } from '@/src/utils';
import Loader from '@/src/components/Loader';
import Error from '@/src/components/Error';

export async function getServerSideProps(context: NextPageContext) {
   // this is how you get session  but inside the getServerSideProps
   // getSession: This is a function from next-auth that retrieves the session object.
   const session = await getSession(context);

   if (!session) {
      // if no session redirect to login 
      return {
         redirect: {
            destination: '/login',
            // This indicates that the redirection is temporary (HTTP status code 307).
            permanent: false,
         }
      }
   }

   // always suppose to return something from getServerSideProps()
   // This object is passed as props to the page component.
   return {
      props: {}
   }
}



const Movie = () => {

   const router = useRouter();
   const { selectedProfile } = useProfile();
   const movieId = router?.query?.id;
   const { data: movie, error, isLoading } = useMovie(movieId as string, selectedProfile?.id);
   // Wait for the router to be ready
   if (!router.isReady) return null;
   const videoRef = useRef<HTMLVideoElement>(null);

   const updateWatchProgress = async (timeInSeconds: number) => {
      if (timeInSeconds) {
         try {
            const res = await axios.post('/api/updateWatchProgress', {
               movieId,
               progress: timeInSeconds,
               profileId: selectedProfile?.id
            });

            console.log(res)
         } catch (e) {
            console.log(e)
         }
      }
   }
   const updateCurrentProgress = async () => {
      const videoElement = videoRef.current as HTMLVideoElement | null;
      if (videoElement) {
         const progressInSeconds = convertTimeToSeconds(videoElement.currentTime);
         await updateWatchProgress(progressInSeconds);
      }
   };

   const handlePause = () => {
      updateCurrentProgress();
   }

   const handleBackClick = async () => {
      await updateCurrentProgress();
      router.push(`/movie/${movieId}`);
   }


   useEffect(() => {
      if (movie) {
         const videoElement = videoRef.current;
         if (videoElement && movie?.watchProgresses?.[0]?.progress !== undefined) {
            const progress = movie.watchProgresses[0].progress;
            videoElement.currentTime = progress;
            videoElement.play().catch(error => console.error('Error playing video:', error));
         }
      }
   }, [movie]);

   // as HTMLVideoElement;

   useEffect(() => {
      const videoElement = videoRef.current as HTMLVideoElement | null;
      const attachPauseListener = () => {
         if (videoElement) {
            videoElement.addEventListener('pause', handlePause);
         }
      };

      const removePauseListener = () => {
         if (videoElement) {
            videoElement.removeEventListener('pause', handlePause);
         }
      };

      if (videoElement) {
         // Only attach the listener if the video is playing
         if (!videoElement.paused) {
            attachPauseListener();
         }

         // Attach listener on 'play' event, which indicates user interaction
         videoElement.addEventListener('play', attachPauseListener);
      }

      return () => {
         removePauseListener();
         if (videoElement) {
            videoElement.removeEventListener('play', attachPauseListener);
         }
      };
   }, [movieId]);


   if (isLoading) return <Loader />;
   if (error) return <Error />;

   return (
      <div className='relative text-white h-screen w-full z-10'>
         <div className=' absolute top-4 left-4 z-20 cursor-pointer'>
            <IoIosArrowRoundBack
               onClick={() => handleBackClick()}
               size="40px"
            />
         </div>
         <video
            ref={videoRef}
            id="movie-video"
            muted
            className="w-full h-screen object-cover brightness-[60%] transition duration-500"
            autoPlay
            poster={movie?.thumbnailUrl}
            src={movie?.videoUrl}
            controls

         />
      </div>
   )

}

export default Movie;