import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import {
  TableDoesNotExist,
  TableExists,
  RowDoesNotExist,
} from './../src/exceptions';
import {
  createTableUtil,
  getTableUtil,
  dropTableUtil,
} from './utils/databaseHook';
import { generatePost, Post } from './utils/mock';
import randomstring, { generate } from 'randomstring';

test('database init', () => {
  const rendered = renderHook(() => useDatabase());
  const { database } = rendered.result.current;
  expect(database).toEqual({});
});

describe('create table', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hook';
    createTableUtil(rendered, tableName);
    const { database } = rendered.result.current;
    expect(database).toEqual({
      [tableName]: {},
    });
  });

  test('twice', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const { createTable } = rendered.result.current;
    expect(() => {
      act(() => createTable(tableName));
    }).toThrowError(TableExists);
  });
});

describe('drop table', () => {
  test('', () => {
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

  test('not exists', () => {
    const rendered = renderHook(() => useDatabase());
    const { dropTable } = rendered.result.current;
    const tableName = 'hoodie';
    expect(() => {
      act(() => dropTable(tableName));
    }).toThrowError(TableDoesNotExist);
  });
});

describe('get table', () => {
  test('', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const table = getTableUtil(rendered, tableName);
    expect(table).toEqual({});
  });

  test('not exists', async () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    expect(() => getTableUtil(rendered, tableName)).toThrowError(
      TableDoesNotExist,
    );
  });
});

describe('drop table', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    dropTableUtil(rendered, tableName);
    expect(rendered.result.current.database).toEqual({});
  });

  test('does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    expect(() => dropTableUtil(rendered, tableName)).toThrowError(
      TableDoesNotExist,
    );
  });
});

describe('set row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() =>
      rendered.result.current.setRow(tableName, samplePost.id, samplePost),
    );

    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: samplePost,
      },
    });
  });

  test('already exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });

    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: samplePost,
      },
    });
  });
});

describe('get row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    expect(rendered.result.current.getRow(tableName, samplePost.id)).toEqual(
      samplePost,
    );
  });

  test('does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    const samplePost = generatePost();
    expect(() =>
      rendered.result.current.getRow(tableName, samplePost.id),
    ).toThrowError(RowDoesNotExist);
  });

  test('from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    expect(() =>
      rendered.result.current.getRow('hoodie', samplePost.id),
    ).toThrowError(TableDoesNotExist);
  });
});

describe('patch row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    act(() => {
      rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
    });
    expect(rendered.result.current.getRow(tableName, samplePost.id)).toEqual(
      Object.assign({}, samplePost, partialPost),
    );
  });

  test('does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    createTableUtil(rendered, tableName);
    expect(() => {
      act(() => {
        rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
      });
    }).toThrowError(RowDoesNotExist);
  });

  test('from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    expect(() => {
      act(() => {
        rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
      });
    }).toThrowError(TableDoesNotExist);
  });
});
