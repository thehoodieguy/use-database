import { Table } from './../../src/types';
import { act, RenderHookResult } from '@testing-library/react-hooks';
import randomstring from 'randomstring';
import { DatabaseHook } from '../../src/hooks/useDatabase';
import { generatePostList, Post } from './mock';

export const createTableUtil = (
  rendered: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): void => {
  const { createTable } = rendered.result.current;
  act(() => {
    createTable(tableName);
  });
};

export const dropTableUtil = (
  rendered: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): void => {
  const { dropTable } = rendered.result.current;
  act(() => {
    dropTable(tableName);
  });
};

export const getTableUtil = <RowType>(
  rendered: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): Table<RowType> => {
  const { getTable } = rendered.result.current;
  return getTable<RowType>(tableName);
};

export const createTableWithRowsUtil = (rendered: RenderHookResult<void, DatabaseHook>, rowNum = 100) => {
  const tableName = randomstring.generate();
  const postList = generatePostList(rowNum);
  act(() => rendered.result.current.createTable(tableName));
  act(() =>
    rendered.result.current.setRowList(
      tableName,
      postList.map(post => ({ id: post.id, row: post })),
    ),
  );
  return { tableName, postList }
}