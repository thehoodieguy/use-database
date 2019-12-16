import { useState, useCallback } from 'react';

export interface Loadable<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
}

function useLoadable<T>({
  defaultIsLoading = false,
  defaultError = null,
  defaultData = null,
}: UseLoadableProps<T> = {}) {
  const [loadable, setLoadable] = useState<Loadable<T>>({
    isLoading: defaultIsLoading,
    error: defaultError,
    data: defaultData,
  });

  const loadData = useCallback(async (loader: () => Promise<T>) => {
    setLoadable(loadable => ({ ...loadable, isLoading: true }));
    try {
      const data = await loader();
      setLoadable({
        error: null,
        isLoading: false,
        data,
      });
    } catch (error) {
      setLoadable({
        error,
        isLoading: false,
        data: null,
      });
    }
  }, []);

  return {
    ...loadable,
    loadData,
  };
}

export interface UseLoadableProps<T> {
  defaultIsLoading?: boolean;
  defaultError?: Error | null;
  defaultData?: T | null;
}

export default useLoadable;
