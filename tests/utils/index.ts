import { Table } from './../../src/types';
import { act, RenderHookResult } from '@testing-library/react-hooks';

import { DatabaseHook } from '../../src/hooks/useDatabase';

export const createTableUtil = (
  renderedHook: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): void => {
  const { createTable } = renderedHook.result.current;
  act(() => {
    createTable(tableName);
  });
};

export const dropTableUtil = (
  hook: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): void => {
  const { dropTable } = hook.result.current;
  act(() => {
    dropTable(tableName);
  });
};

export const getTableUtil = <RowType>(
  hook: RenderHookResult<void, DatabaseHook>,
  tableName: string,
): Table<RowType> => {
  const { getTable } = hook.result.current;
  return getTable<RowType>(tableName);
};
