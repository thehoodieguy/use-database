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
  createTableWithRowsUtil,
} from './utils/databaseHook';
import { generatePost, Post, generatePostList } from './utils/mock';
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

  test('on table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    const samplePost = generatePost();
    expect(() =>
      act(() => {
        rendered.result.current.setRow(tableName, samplePost.id, samplePost);
      }),
    ).toThrowError(TableDoesNotExist);
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

describe('delete row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    act(() =>
      rendered.result.current.setRow(tableName, samplePost.id, samplePost),
    );
    act(() => rendered.result.current.deleteRow(tableName, samplePost.id));
    expect(samplePost.id in rendered.result.current.database[tableName]).toBe(
      false,
    );
  });

  test('does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    expect(() =>
      act(() => rendered.result.current.deleteRow(tableName, samplePost.id)),
    ).toThrowError(RowDoesNotExist);
  });

  test('on table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    expect(() =>
      act(() => rendered.result.current.deleteRow(tableName, samplePost.id)),
    ).toThrowError(TableDoesNotExist);
  });
});

describe('set row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = createTableWithRowsUtil(rendered);
    const tableExpected = Object.fromEntries(postList.map(post => [post.id, post]));
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    })
  });

  test('with exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    const postListBefore = postList.slice(0, 50).map(post => generatePost({ id: post.id }));
    act(() => rendered.result.current.createTable(tableName));
    act(() =>
      rendered.result.current.setRowList(
        tableName,
        postListBefore.map(post => ({ id: post.id, row: post })),
      ),
    );
    act(() =>
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      ),
    );
    const tableExpected = Object.fromEntries(postList.map(post => [post.id, post]));
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    })
  });

  test('with all exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    act(() => rendered.result.current.createTable(tableName));
    act(() =>
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      ),
    );
    act(() =>
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      ),
    );
    const tableExpected = Object.fromEntries(postList.map(post => [post.id, post]));
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    })
  });
});

describe('get row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = createTableWithRowsUtil(rendered);
    expect(rendered.result.current.getRowList(tableName, postList.map(post => post.id))).toEqual(postList);
  });

  test('which do not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    const postList = generatePostList(100);
    expect(rendered.result.current.getRowList(tableName, postList.map(post => post.id))).toEqual(postList.map(() => undefined));
  });

  test('with check row', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    const postList = generatePostList(100);
    expect(() => rendered.result.current.getRowList(tableName, postList.map(post => post.id), true)).toThrowError(RowDoesNotExist);
  });
});

describe('delete row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = createTableWithRowsUtil(rendered);
    act(() => rendered.result.current.deleteRowList(tableName, postList.map(post => post.id)))
    expect(rendered.result.current.database).toEqual({
      [tableName]: {}
    });
  });

  test('which do not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    const postList = generatePostList(100);
    act(() => rendered.result.current.deleteRowList(tableName, postList.map(post => post.id)));
    expect(rendered.result.current.database).toEqual({
      [tableName]: {}
    });
  });

  test('which do not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    act(() => rendered.result.current.createTable(tableName));
    const postList = generatePostList(100);
    expect(() => act(() => rendered.result.current.deleteRowList(tableName, postList.map(post => post.id), true))).toThrowError(RowDoesNotExist);
  });
});

describe('patch row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const rowNum = 100;
    const { tableName, postList } = createTableWithRowsUtil(rendered, rowNum);
    const partialNewPostList = postList.slice(0, 50).map(post => generatePost({ id: post.id }));
    const tableExpected = 
    {
      ...Object.fromEntries(postList.map(post => [post.id, post])),
      ...Object.fromEntries(partialNewPostList.map(post => [post.id, post]))
    };
    act(() => rendered.result.current.patchRowList(tableName, partialNewPostList.map(post => ({ id: post.id, row: post }))));
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    })
  });
});
