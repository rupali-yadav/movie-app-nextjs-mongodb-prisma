import useSwr from 'swr'
import fetcher from '@/src/lib/fetcher';
import { iMovie } from '@/src/types';

type useMovieListReturns = {
  data: Array<iMovie>;
  error: any;
  isLoading: boolean;
}


const useMovieList = (): useMovieListReturns => {

  // 1. useSwr: hook from the SWR library used for data fetching and caching
  // 2. fetcher: A custom function for fetching data from an API. This function is typically defined to standardize the way data is fetched in your applicatio
  // useSwr: This hook is called with two arguments:
  // '/api/getCurrentUser': The key or endpoint to fetch data from.
  // fetcher: The function that performs the fetch operation.

  const { data, error, isLoading } = useSwr('/api/getMovies', fetcher, {
    revalidateIfStale: true,
    // revalidateOnFocus: true,
    // revalidateOnReconnect: true
  });

  return {
    data,
    error,
    isLoading
  }
};

export default useMovieList;


// useSwr: This is the main .