import React, { useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import MovieList from "@/src/components/MovieList";
import Error from "@/src/components/Error";
import useMovieList from "@/hooks/useMovieList";
import { getSession } from "next-auth/react";
import useWatchProgresses from "@/hooks/useWatchProgresses";
import { iMovie } from "@/src/types";
import { useProfile } from "@/src/context/profileContext";
import { NextPageContext } from "next";
import Loader from "@/src/components/Loader";
import HeroBanner from "@/src/components/HeroBanner";

// getSesssion can be used inside getserversideprops
// but to useSession can be used on client side apps and wrap the _app.tsx in the sessionProvider

export async function getServerSideProps(context: NextPageContext) {
  // this is how you get session  but inside the getServerSideProps
  // getSession: This is a function from next-auth that retrieves the session object.
  const session = await getSession(context);

  if (!session) {
    // if no session redirect to login
    return {
      redirect: {
        destination: "/login",
        // This indicates that the redirection is temporary (HTTP status code 307).
        permanent: false,
      },
    };
  }

  // always suppose to return something from getServerSideProps()
  // This object is passed as props to the page component.
  return {
    props: {},
  };
}

const Home = () => {
  const { selectedProfile } = useProfile();


  const {
    data: movies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovieList();

  const {
    data: watchProgresses,
    isLoading: progressLoading,
    error: progressError,
  } = useWatchProgresses(selectedProfile?.id || "");

  const isLoading = moviesLoading || progressLoading;
  const isError = moviesError || progressError;

  let continueWatchingMovies: Array<iMovie> = [];
  if (watchProgresses?.length) {
    continueWatchingMovies = watchProgresses?.map((item) => ({
      ...item.movie,
      progress: item.progress,
    }));
  }
  const getRandomMovieId = (): iMovie => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <>
      {!isLoading && !isError && movies?.length && (
        <>
          <Navbar />
          <HeroBanner movie={getRandomMovieId()} />
          <MovieList
            title="Continue watching"
            movies={continueWatchingMovies}
          />
          <MovieList
            title="Trending"
            movies={movies}
          />
        </>
      )}
    </>
  );
};

export default Home;
