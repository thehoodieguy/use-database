import { Table } from './../../src/types';
import { act, RenderHookResult } from '@testing-library/react-hooks';
import randomstring from 'randomstring';
import { DatabaseHook } from '../../src/hooks/useDatabase';
import { generatePostList } from './mock';

export const getTableUtil = <RowType>(
  rendered: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): Table<RowType> => {
  const { getTable } = rendered.result.current;
  return getTable<RowType>(tableName);
};

export const setTableWithRowsUtil = (
  rendered: RenderHookResult<void, DatabaseHook>,
  rowNum = 100,
) => {
  const tableName = randomstring.generate();
  const postList = generatePostList(rowNum);
  act(() => {
    rendered.result.current.setRowList(
      tableName,
      postList.map(post => ({ id: post.id, row: post })),
    );
  });
  return { tableName, postList };
};
