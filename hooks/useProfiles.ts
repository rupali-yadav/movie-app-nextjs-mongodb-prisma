import useSwr from 'swr';
import fetcher from '@/src/lib/fetcher';
import { iProfile } from '@/src/types';

type useProfilesReturns = {
  data: Array<iProfile>;
  error: any;
  isLoading: boolean;
}

const useProfiles = (): useProfilesReturns => {
  const { data, error, isLoading } = useSwr('/api/getProfiles', fetcher, {
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    refreshInterval: 2000
  });

  return {
    data,
    error,
    isLoading
  };
};

export default useProfiles;