import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import { getTableUtil, setTableWithRowsUtil } from './utils/databaseHook';
import { generatePost, Post, generatePostList } from './utils/mock';
import randomstring from 'randomstring';

test('database init', () => {
  const rendered = renderHook(() => useDatabase());
  const { database } = rendered.result.current;
  expect(database).toEqual({});
});

describe('get table', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    act(() => {
      getTableUtil(rendered, tableName);
    });
    expect(rendered.result.current.database).toEqual({
      [tableName]: {},
    });
  });
});

describe('set row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });

    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: samplePost,
      },
    });
  });

  test('already exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
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
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
  });
});

describe('get row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
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
    const samplePost = generatePost();
    act(() => {
      rendered.result.current.getRow(tableName, samplePost.id);
    });
    expect(rendered.result.current.database).toEqual({});
  });

  test('from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => {
      rendered.result.current.getRow(tableName, samplePost.id);
    });
    expect(rendered.result.current.database).toEqual({});
  });
});

describe('patch row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
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
    act(() => {
      rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
    });
  });

  test('from table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    act(() => {
      rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
    });
    expect(rendered.result.current.database).toEqual({
      [tableName]: {
        [samplePost.id]: partialPost,
      },
    });
  });
});

describe('delete row', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    act(() => {
      rendered.result.current.deleteRow(tableName, samplePost.id);
    });
    expect(samplePost.id in rendered.result.current.database[tableName]).toBe(
      false,
    );
  });

  test('does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => {
      rendered.result.current.deleteRow(tableName, samplePost.id);
    });
  });

  test('on table does not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    act(() => {
      rendered.result.current.deleteRow(tableName, samplePost.id);
    });
  });
});

describe('set row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = setTableWithRowsUtil(rendered);
    const tableExpected = Object.assign(
      {},
      ...postList.map(post => ({ [post.id]: post })),
    );
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    });
  });

  test('with exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    const postListBefore = postList
      .slice(0, 50)
      .map(post => generatePost({ id: post.id }));
    act(() => {
      rendered.result.current.setRowList(
        tableName,
        postListBefore.map(post => ({ id: post.id, row: post })),
      );
    });
    act(() => {
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      );
    });
    const tableExpected = Object.assign(
      {},
      ...postList.map(post => ({ [post.id]: post })),
    );
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    });
  });

  test('with all exists', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    act(() => {
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      );
    });
    act(() => {
      rendered.result.current.setRowList(
        tableName,
        postList.map(post => ({ id: post.id, row: post })),
      );
    });
    const tableExpected = Object.assign(
      {},
      ...postList.map(post => ({ [post.id]: post })),
    );
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    });
  });
});

describe('get row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = setTableWithRowsUtil(rendered);
    expect(
      rendered.result.current.getRowList(
        tableName,
        postList.map(post => post.id),
      ),
    ).toEqual(postList);
  });

  test('which do not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    act(() => {
      expect(
        rendered.result.current.getRowList(
          tableName,
          postList.map(post => post.id),
        ),
      ).toEqual(postList.map(() => undefined));
    });
  });
});

describe('delete row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const { tableName, postList } = setTableWithRowsUtil(rendered);
    act(() => {
      rendered.result.current.deleteRowList(
        tableName,
        postList.map(post => post.id),
      );
    });
    expect(rendered.result.current.database).toEqual({
      [tableName]: {},
    });
  });

  test('which do not exist', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = randomstring.generate();
    const postList = generatePostList(100);
    act(() => {
      rendered.result.current.deleteRowList(
        tableName,
        postList.map(post => post.id),
      );
    });
  });
});

describe('patch row list', () => {
  test('', () => {
    const rendered = renderHook(() => useDatabase());
    const rowNum = 100;
    const { tableName, postList } = setTableWithRowsUtil(rendered, rowNum);
    const partialNewPostList = postList
      .slice(0, 50)
      .map(post => generatePost({ id: post.id }));
    const tableExpected = {
      ...Object.assign({}, ...postList.map(post => ({ [post.id]: post }))),
      ...Object.assign(
        {},
        ...partialNewPostList.map(post => ({ [post.id]: post })),
      ),
    };
    act(() => {
      rendered.result.current.patchRowList(
        tableName,
        partialNewPostList.map(post => ({ id: post.id, row: post })),
      );
    });
    expect(rendered.result.current.database).toEqual({
      [tableName]: tableExpected,
    });
  });
});
