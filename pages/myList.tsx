import useWatchListMovies from "@/hooks/useWatchListMovies";
import MovieList from "@/src/components/MovieList";
import Navbar from "@/src/components/Navbar";
import { useProfile } from "@/src/context/profileContext";
import { iMovie, iMovieWrapper } from "@/src/types";
import { CircleOff } from "lucide-react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context: NextPageContext) {
    // this is how you get session on client side
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



const MyList = () => {
    const router = useRouter();
    const { selectedProfile } = useProfile();
    const { data: movies, isLoading } = useWatchListMovies(selectedProfile?.id as string);

    let myListMovies: Array<iMovie> = [];
    if (movies?.length) {
        myListMovies = movies?.map((item: iMovieWrapper) => ({
            ...item?.movie,
        }));
    }
    return (
        <>
            <Navbar />
            {movies?.length > 0 ?
                (<MovieList title="My watch list" movies={myListMovies} />) : (
                    <div className=" text-white flex flex-col items-center justify-center h-[80vh]">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <CircleOff size={100} />
                            <h3 className="text-2xl font-semibold">There are no movies in your watch list </h3>
                            <button type="button" onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md">Add Movies</button>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default MyList;