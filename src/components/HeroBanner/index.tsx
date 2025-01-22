import { iMovie } from '@/src/types';
import { useRouter } from 'next/router';
import { FaPlay } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";


const HeroBanner = ({ movie }: { movie: iMovie }) => {
    const router = useRouter();

    return (
        <button
            type="button"
            className="relative h-[50vh] md:h-[70vh] cursor-pointer w-full"
            onClick={() => router.push(`/movie/${movie?.id}`)}
        >
            <video
                muted
                poster={movie?.thumbnailUrl}
                className="w-full h-full object-cover brightness-[100%] hover:brightness-[80%] transition"
                src={movie?.videoUrl}
                autoPlay
                loop
            />
            <div className="absolute flex items-center text-white bottom-10 px-4 md:px-10 text-[18px] gap-5">
                <div className="size-[80px] md:size-[100px] border-4 border-white rounded-full flex items-center justify-center">
                    <FaPlay size="50px" className="ml-2" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-6xl font-bold mb-2 text-left">{movie?.title}</h2>
                    <div className="flex gap-4 items-center">
                        <p className="bg-slate-100 rounded-lg text-black font-medium text-xs w-max px-2 py-1 cursor-auto">{movie?.genre}</p>
                        <IoMdInformationCircleOutline
                            size="22px"
                            color="white"
                            onClick={() => router.push(`/movie/${movie?.id}`)}
                        />
                    </div>
                </div>
            </div>
        </button>
    )
}

export default HeroBanner;