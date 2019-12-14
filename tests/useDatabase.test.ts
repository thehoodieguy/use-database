import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import { TableDoesNotExists, TableExists } from './../src/exceptions';
import { createTableFromHook, getTableFromHook } from './utils';

test('use database init', () => {
  const hook = renderHook(() => useDatabase());
  const { database } = hook.result.current;
  expect(database).toEqual({});
});

test('create database', () => {
  const hook = renderHook(() => useDatabase());
  const tableName = 'hook';
  createTableFromHook(hook, tableName);
  const { database } = hook.result.current;
  expect(database).toEqual({
    [tableName]: {},
  });
});

test('create database twice', async () => {
  const hook = renderHook(() => useDatabase());
  const tableName = 'hoodie';
  createTableFromHook(hook, tableName);
  const { createTable } = hook.result.current;
  expect(() => {
    act(() => createTable(tableName));
  }).toThrowError(TableExists);
});

test('delete database', () => {
  const hook = renderHook(() => useDatabase());
  const tableName = 'hoodie';
  createTableFromHook(hook, tableName);
  const { dropTable } = hook.result.current;
  act(() => {
    dropTable(tableName);
  });
  const { database } = hook.result.current;
  expect(database).toEqual({});
});

test('delete database not exists', () => {
  const hook = renderHook(() => useDatabase());
  const { dropTable } = hook.result.current;
  const tableName = 'hoodie';
  expect(() => {
    act(() => dropTable(tableName));
  }).toThrowError(TableDoesNotExists);
});

test('get table', async () => {
  const hook = renderHook(() => useDatabase());
  const tableName = 'hoodie';
  createTableFromHook(hook, tableName);
  const table = getTableFromHook(hook, tableName);
  expect(table).toEqual({});
});
