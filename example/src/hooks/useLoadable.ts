import { useState } from 'react';
import { useTable } from 'react-normalizer-hook/dist';
import { TABLE_NAME, Post } from '../domain/post';

function useLoadablePostList({
  defaultIsLoading = false,
  defaultError = null,
}: UseLoadableProps = {}) {
  const { getRowList, setRowList } = useTable<Post>(TABLE_NAME);
  const [isLoading, setIsLoading] = useState(defaultIsLoading);
  const [error, setError] = useState(defaultError);
  const [idList, setIdList] = useState<string[]>([]);

  const loadData = async (loader: () => Promise<Post[]>) => {
    setIsLoading(true);
    try {
      const postList = await loader();
      await setRowList(postList.map(post => ({ id: post.id, row: post })));
      setIdList(postList.map(post => post.id));
      setError(null);
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  };

  const data = idList.length > 0 ? getRowList(idList) : [];

  return {
    isLoading,
    error,
    data,
    loadData,
  };
}

export interface UseLoadableProps {
  defaultIsLoading?: boolean;
  defaultError?: Error | null;
}

export default useLoadablePostList;
