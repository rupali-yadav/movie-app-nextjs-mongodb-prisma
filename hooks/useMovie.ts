import useSwr from 'swr'
import fetcher from '@/src/lib/fetcher';
import { iMovie } from '@/src/types';

type useMovieReturns = {
    data: iMovie;
    error: any;
    isLoading: boolean;
}

const useMovie = (id: string, profileId?: string | null): useMovieReturns => {
    const { data, error, isLoading } = useSwr(id && profileId ? `/api/movies/${id}?profileId=${profileId}` : null, fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 5000
    });

    return {
        data,
        error,
        isLoading
    }
};

export default useMovie;