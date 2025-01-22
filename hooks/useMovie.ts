import useSwr from 'swr'
import fetcher from '@/src/lib/fetcher';
import { iMovie } from '@/src/types';

type useMovieReturns = {
    data: iMovie;
    error: any;
    isLoading: boolean;
    mutate: any;
}

const useMovie = (id: string, profileId?: string | null): useMovieReturns => {
    const { data, error, isLoading, mutate } = useSwr(id && profileId ? `/api/movies/${id}?profileId=${profileId}` : null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 5000
    });

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useMovie;