import { act, renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';
import { setTableWithRowsUtil } from './utils/databaseHook';
import { generatePost, Post, generatePostList } from './utils/mock';
import randomstring from 'randomstring';

test('database init', () => {
  const rendered = renderHook(() => useDatabase());
  const { database } = rendered.result.current;
  expect(database).toEqual({});
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

  test('func do not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const prevSetRow = rendered.result.current.setRow;
    const tableName = randomstring.generate();
    const post = generatePost();
    act(() => {
      prevSetRow(tableName, post.id, post);
    });
    expect(rendered.result.current.setRow === prevSetRow).toBeTruthy();
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

  test('func rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const tableName = 'hoodie';
    const samplePost = generatePost();
    const prevGetRow = rendered.result.current.getRow;
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    expect(prevGetRow === rendered.result.current.getRow).toBeFalsy();
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

  test('func does not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const partialPost: Partial<Post> = { body: randomstring.generate() };
    const tableName = 'hoodie';
    const prevPatchRow = rendered.result.current.patchRow;
    act(() => {
      rendered.result.current.patchRow(tableName, samplePost.id, partialPost);
    });
    expect(prevPatchRow === rendered.result.current.patchRow).toBeTruthy();
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

  test('func does not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const samplePost = generatePost();
    const tableName = randomstring.generate();
    const prevDeleteRow = rendered.result.current.deleteRow;
    act(() => {
      rendered.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    act(() => {
      rendered.result.current.deleteRow(tableName, samplePost.id);
    });
    expect(rendered.result.current.deleteRow === prevDeleteRow).toBeTruthy();
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

  test('func does not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const prevSetRowList = rendered.result.current.setRowList;
    setTableWithRowsUtil(rendered);
    expect(prevSetRowList === rendered.result.current.setRowList);
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

  test('func rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const prevGetRowList = rendered.result.current.getRowList;
    setTableWithRowsUtil(rendered);
    expect(prevGetRowList === rendered.result.current.getRowList).toBeFalsy();
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

  test('func does not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const prevDeleteRowList = rendered.result.current.deleteRowList;
    const { tableName, postList } = setTableWithRowsUtil(rendered);
    act(() => {
      rendered.result.current.deleteRowList(
        tableName,
        postList.map(post => post.id),
      );
    });
    expect(prevDeleteRowList).toBe(rendered.result.current.deleteRowList);
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

  test('func does not rerender', () => {
    const rendered = renderHook(() => useDatabase());
    const prevFunc = rendered.result.current.patchRowList;
    const rowNum = 100;
    const { tableName, postList } = setTableWithRowsUtil(rendered, rowNum);
    const partialNewPostList = postList
      .slice(0, 50)
      .map(post => generatePost({ id: post.id }));
    act(() => {
      rendered.result.current.patchRowList(
        tableName,
        partialNewPostList.map(post => ({ id: post.id, row: post })),
      );
    });
    expect(prevFunc === rendered.result.current.patchRowList);
  });
});
