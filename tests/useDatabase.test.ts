import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import {
  TableDoesNotExists,
  TableExists,
  RowDoesNotExists,
} from './../src/exceptions';
import { createTableUtil, getTableUtil, dropTableUtil } from './utils';
import { generatePost, Post } from './utils/mock';
import randomstring, { generate } from 'randomstring';

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

describe('drop table', () => {
  test('drop table', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    dropTableUtil(rendered, tableName);
    expect(rendered.result.current.database).toEqual({});
  });

  test('drop table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    expect(() => dropTableUtil(rendered, tableName)).toThrowError(
      TableDoesNotExists,
    );
  });
});

describe('set data', () => {
  test('set data', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() =>
      rendered.result.current.setData(tableName, samplePost.id, samplePost),
    );

    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: samplePost,
      },
    });
  });

  test('set data already exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.setData(tableName, samplePost.id, samplePost);
      rendered.result.current.setData(tableName, samplePost.id, samplePost);
    });

    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: samplePost,
      },
    });
  });
});

describe('get data', () => {
  test('get data', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.setData(tableName, samplePost.id, samplePost);
    });
    expect(rendered.result.current.getData(tableName, samplePost.id)).toEqual(
      samplePost,
    );
  });

  test('get data does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    expect(() =>
      rendered.result.current.getData(tableName, samplePost.id),
    ).toThrowError(RowDoesNotExists);
  });

  test('get data from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    expect(() =>
      rendered.result.current.getData('hoodie', samplePost.id),
    ).toThrowError(TableDoesNotExists);
  });
});

describe('patch data', () => {
  test('patch data', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    act(() => {
      rendered.result.current.setData(tableName, samplePost.id, samplePost);
    });
    act(() => {
      rendered.result.current.patchData(tableName, samplePost.id, partialPost);
    });
    expect(rendered.result.current.getData(tableName, samplePost.id)).toEqual(
      Object.assign({}, samplePost, partialPost),
    );
  });

  test('patch data does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    expect(() => {
      act(() => {
        rendered.result.current.patchData(
          tableName,
          samplePost.id,
          partialPost,
        );
      });
    }).toThrowError(RowDoesNotExists);
  });

  test('patch data from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    expect(() => {
      act(() => {
        rendered.result.current.patchData(
          tableName,
          samplePost.id,
          partialPost,
        );
      });
    }).toThrowError(TableDoesNotExists);
  });
});
