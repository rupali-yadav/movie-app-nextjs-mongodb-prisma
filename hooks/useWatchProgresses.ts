import useSwr from 'swr';
import fetcher from '@/src/lib/fetcher';
import { iWatchProgress } from '@/src/types';

type useWatchProgressesReturns = {
  data: Array<iWatchProgress>;
  error: any;
  isLoading: boolean;
}

const useWatchProgresses = (profileId: string): useWatchProgressesReturns => {

  const { data, error, isLoading } = useSwr(profileId ? `/api/getWatchProgresses?profileId=${profileId}` : null, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  return {
    data,
    error,
    isLoading
  };
};

export default useWatchProgresses;