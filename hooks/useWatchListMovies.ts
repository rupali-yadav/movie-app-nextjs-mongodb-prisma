import useSwr from 'swr'
import fetcher from '@/src/lib/fetcher';
import { iMovieWrapper } from '@/src/types';

type useMovieListReturns = {
  data: Array<iMovieWrapper>;
  error: any;
  isLoading: boolean;
}


const useWatchListMovies = (profileId: string): useMovieListReturns => {

  const { data, error, isLoading } = useSwr(profileId ? `/api/getWatchListMovies?profileId=${profileId}` : null, fetcher, {
    revalidateIfStale: true,
  });

  return {
    data,
    error,
    isLoading
  }
};

export default useWatchListMovies;


// useSwr: This is the main .