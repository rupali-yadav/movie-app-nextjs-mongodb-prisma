import useMovieList from "@/hooks/useMovieList";
import { useRouter } from "next/router";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsPlayBtn } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import { iMovie } from "@/src/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Iprops {
  title: string;
  movies: Array<iMovie>;
}

const MovieCard = ({
  router,
  movie: { title, id, videoUrl, thumbnailUrl, genre },
}: {
  router: any;
  movie: iMovie;
}) => (
  <button
    onClick={() => router.push(title === 'Continue watching' ? `/play/${id}` : `/movie/${id}`)}
    className="relative text-white cursor-pointer w-[90%] h-[200px] md:w-[30%] md:h-[250px] flex-shrink-0 hover:border-2 border-white rounded"
  >
    <video
      muted
      poster={thumbnailUrl}
      className="w-full h-full object-cover brightness-[60%] hover:brightness-[30%] transition"
      src={videoUrl}
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[70px] border-4 border-white rounded-full flex items-center justify-center">
      <FaPlay size="30px" className="ml-1" />
    </div>
    <div className="absolute top-0 left-0 w-full flex justify-between p-4">
      <div className=" top-5 left-5 text-[14px] font-medium">
        <h3 className="text-2xl mb-2">{title}</h3>
        <p className="text-sm bg-slate-100 py-1 px-3 rounded-md w-max text-black">
          {genre}
        </p>
      </div>
      <IoMdInformationCircleOutline />
    </div>
  </button>
);

const MovieList = ({ title, movies }: Iprops) => {
  const router = useRouter();

  return (
    <>
      {movies?.length > 0 && (
        <div className="py-8 px-4 lg:px-10">
          <h2 className="text-white font-semibold mb-8 text-3xl">{title}</h2>
          <ScrollArea className="max-w-[100vw] md:w-full whitespace-nowrap rounded-md pb-5">
            <div className="flex gap-x-4 gap-y-8 justify-between">
              {movies?.length > 0
                ? movies.map((movie: iMovie) => (
                  <MovieCard key={movie?.id} movie={movie} router={router} />
                ))
                : null}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default MovieList;
