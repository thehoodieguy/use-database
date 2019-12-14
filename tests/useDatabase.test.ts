import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import { TableDoesNotExists, TableExists } from './../src/exceptions';
import { createTableUtil, getTableUtil } from './utils';

test('use database init', () => {
  const rendered = renderHook(() => useDatabase());
  const { database } = rendered.result.current;
  expect(database).toEqual({});
});

describe('create db', () => {
  test('create database', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hook';
    createTableUtil(rendered, tableName);
    const { database } = rendered.result.current;
    expect(database).toEqual({
      [tableName]: {},
    });
  });

  test('create database twice', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const { createTable } = rendered.result.current;
    expect(() => {
      act(() => createTable(tableName));
    }).toThrowError(TableExists);
  });
});

describe('delete db', () => {
  test('delete database', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const { dropTable } = rendered.result.current;
    act(() => {
      dropTable(tableName);
    });
    const { database } = rendered.result.current;
    expect(database).toEqual({});
  });

  test('delete database not exists', () => {
    const rendered = renderHook(() => useDatabase());
    const { dropTable } = rendered.result.current;
    const tableName = 'hoodie';
    expect(() => {
      act(() => dropTable(tableName));
    }).toThrowError(TableDoesNotExists);
  });
});

describe('get db', () => {
  test('get table', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const table = getTableUtil(rendered, tableName);
    expect(table).toEqual({});
  });

  test('get table not exists', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    expect(() => getTableUtil(rendered, tableName)).toThrowError(
      TableDoesNotExists,
    );
  });
});
