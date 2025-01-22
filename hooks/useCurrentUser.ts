import fetcher from '@/src/lib/fetcher';
import useSwr from 'swr'

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/getCurrentUser', fetcher, {
    revalidateIfStale: true,
    revalidateOnReconnect: true
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  }
};

export default useCurrentUser;


// useSwr: This is a React hook from the SWR library, which stands for "stale-while-revalidate."
// SWR is used for data fetching in React applications, providing features like caching, revalidation, and automatic updates.

// fetcher: This is a custom function (presumably defined in @/lib/fetcher) that is used to fetch data from an API.
// It's a common practice to create a reusable fetcher function when using SWR.