import { TABLE_NAME } from './../domain/post';
import { useTable } from 'use-database/dist';
import { useState, useMemo, useEffect } from 'react';
import { Post } from '../domain/post';
import { listPosts } from '../actions/post';
import { TableKeyType } from 'use-database/dist/types';

export interface Loadable<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
}

function useLoadablePostList() {
  const [loadable, setLoadable] = useState<Loadable<TableKeyType[]>>({
    isLoading: true,
    error: null,
    data: null,
  });

  const { setRowList, getRowList } = useTable<Post>(TABLE_NAME);

  const postList = useMemo(
    () => (loadable.data ? getRowList(loadable.data) : null),
    [loadable, getRowList],
  );

  useEffect(() => {
    const asyncEffect = async () => {
      setLoadable(loadable => ({ ...loadable, isLoading: false }));
      try {
        const postList = await listPosts();
        const data = setRowList(
          postList.map(post => ({ id: post.id, row: post })),
        );
        setLoadable({
          isLoading: false,
          error: null,
          data,
        });
      } catch (error) {
        setLoadable({ isLoading: false, error: error, data: null });
      }
    };
    asyncEffect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isLoading: loadable.isLoading,
    error: loadable.error,
    postList,
  };
}
export default useLoadablePostList;
