import { useState } from "react";
import useMovie from "@/hooks/useMovie";
import Loader from "@/src/components/Loader";
import { useProfile } from "@/src/context/profileContext";
import { updateProgress } from "@/src/utils";
import axios from "axios";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FaPlay, FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoMdShare } from "react-icons/io";


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



const MovieInfo = () => {
    const router = useRouter();
    const { selectedProfile } = useProfile();
    const movieId = router?.query?.id || "";
    const { data: movie, isLoading = true } = useMovie(movieId as string, selectedProfile?.id as string);
    const progress = movie?.watchProgresses[0]?.progress || 0;
    const videoRef = useRef(null);
    const [isFavorite, setIsFavorite] = useState(movie?.isFavorite || false);

    const addToWatchList = async () => {
        console.log(movie)
        if (selectedProfile?.id && !isLoading) {
            try {
                let resp;
                if (!movie?.isFavorite) {
                    // POST request to add movie to watchlist
                    resp = await axios.post('/api/addToWatchList', {
                        movieId,
                        profileId: selectedProfile?.id
                    });
                    setIsFavorite(true);
                } else {
                    // DELETE request to remove movie from watchlist
                    resp = await axios.delete('/api/addToWatchList', {
                        data: {   // Data must be passed inside `data` key
                            movieId: movieId,
                            profileId: selectedProfile?.id
                        }
                    });
                    setIsFavorite(false);
                }

            } catch (e) {
                console.log(e)
            }
        }
    }
    const handleShare = async () => {
        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title, // The title of the page
                    url: window.location.href, // The current page URL
                });
                console.log("Content shared successfully!");
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Web Share API is not supported in this browser.");
        }
    };

    const updateWatchProgress = async (progress: number) => {
        if (progress && movieId && selectedProfile?.id) {
            try {
                await updateProgress(progress, movieId, selectedProfile?.id);
                router.push(`/play/${movieId}`)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onStartOver = () => {
        updateWatchProgress(0);
        router.push(`/play/${movieId}`)
    }

    const onResume = () => {
        router.push(`/play/${movieId}`)
    }

    if (isLoading) return <Loader />;


    return (
        <>
            {isLoading ?
                (<Loader />) : (
                    <div className="text-white">
                        <div className="relative h-[60vh] cursor-pointer">
                            <video
                                id="movie-video"
                                ref={videoRef}
                                muted
                                poster={movie?.thumbnailUrl}
                                src={movie?.videoUrl}
                                className="w-full h-full object-cover brightness-[60%] transition duration-500"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[70px] border-4 border-white rounded-full flex items-center justify-center">
                                <FaPlay size="30px" className="ml-1" onClick={() => { progress ? onResume() : onStartOver() }} />
                            </div>
                            <IoIosArrowRoundBack
                                onClick={() => router.push('/')}
                                size="40px"
                                className="absolute top-6 left-10"
                            />
                        </div >

                        <div className="px-10 mt-10">
                            <h2 className="font-bold text-2xl">{movie?.title}</h2>
                            <div className="my-5 flex items-start gap-5  text-black font-semibold">
                                {progress !== 0 ? (
                                    <>
                                        <button
                                            type="button"
                                            className=" bg-white px-4 py-2 rounded-sm"
                                            onClick={onResume}
                                        >
                                            Resume
                                        </button>
                                        <button
                                            type="button"
                                            className=" bg-white px-4 py-2 rounded-sm"
                                            onClick={onStartOver}
                                        >
                                            Start over
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className=" bg-white px-4 py-2 rounded-sm"
                                        onClick={onStartOver}
                                    >
                                        Play
                                    </button>
                                )}
                            </div>

                            <p className="w-full md:w-[60%]">{movie?.description}</p>

                            <div className="mt-10 flex items-center gap-5">
                                <button
                                    type="button"
                                    className=" bg-none"
                                    aria-label="Add to watchlist"
                                    onClick={addToWatchList}
                                >
                                    <FaPlus color={isFavorite ? "blue" : "white"} size="30px" />
                                </button>

                                <button
                                    type="button" className=" bg-none"
                                    onClick={handleShare}
                                    aria-label="Share"
                                >
                                    <IoMdShare color="white" size="30px" />
                                </button>
                            </div>
                        </div>

                    </div>
                )
            }
        </>
    )
}

export default MovieInfo;