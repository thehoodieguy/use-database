import { Table } from './../src/types';
import { act, RenderHookResult } from '@testing-library/react-hooks';

import { UseDatabaseResult } from '../src/hooks/useDatabase';

export const createTableFromHook = (
  hook: RenderHookResult<void, UseDatabaseResult>,
  tableName: string,
): void => {
  const { createTable } = hook.result.current;
  act(() => {
    createTable(tableName);
  });
};

export const dropTableFromHook = (
  hook: RenderHookResult<void, UseDatabaseResult>,
  tableName: string,
): void => {
  const { dropTable } = hook.result.current;
  act(() => {
    dropTable(tableName);
  });
};

export const getTableFromHook = <RowType>(
  hook: RenderHookResult<void, UseDatabaseResult>,
  tableName: string,
): Table<RowType> => {
  const { getTable } = hook.result.current;
  return getTable<RowType>(tableName);
};
