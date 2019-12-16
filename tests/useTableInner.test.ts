import useDatabase from '../src/hooks/useDatabase';
import { renderHook, act } from '@testing-library/react-hooks';
import { Post, generatePost, generatePostList } from './utils/mock';
import randomstring from 'randomstring';
import useTableInner from '../src/hooks/useTableInner';

const build = () => {
  const renderedDb = renderHook(() => useDatabase());
  const tableName = randomstring.generate();
  const rendered = renderHook(() =>
    useTableInner<Post>({ databaseHook: renderedDb.result.current, tableName }),
  );
  return {
    renderedDb,
    rendered,
    tableName,
  };
};

describe('get row', () => {
  test('func rerender', () => {
    const { renderedDb, rendered, tableName } = build();
    const samplePost = generatePost();
    const prevGetRow = rendered.result.current.getRow;
    act(() => {
      renderedDb.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    rendered.rerender();
    expect(rendered.result.current.getRow === prevGetRow).toBeFalsy();
  });
});

describe('set row', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const samplePost = generatePost();
    const prevFunc = rendered.result.current.setRow;
    expect(rendered.result.current.getRow(samplePost.id)).toBeFalsy();
    act(() => {
      rendered.result.current.setRow(samplePost.id, samplePost);
    });
    rendered.rerender();
    expect(rendered.result.current.setRow).toBe(prevFunc);
    expect(rendered.result.current.getRow(samplePost.id)).toBe(samplePost);
  });
});

describe('patch row', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const prevFunc = rendered.result.current.patchRow;
    const postBefore = generatePost();
    const postAfter: Partial<Post> = { body: generatePost().body };
    act(() => {
      rendered.result.current.patchRow(postBefore.id, postAfter);
    });
    rendered.rerender();
    expect(prevFunc).toBe(rendered.result.current.patchRow);
  });
});

describe('delete row', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const post = generatePost();
    const prevFunc = rendered.result.current.deleteRow;
    act(() => {
      rendered.result.current.setRow(post.id, post);
    });
    rendered.rerender();
    expect(rendered.result.current.getRow(post.id)).toEqual(post);
    expect(rendered.result.current.deleteRow).toBe(prevFunc);
  });
});

describe('set row list', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const prevFunc = rendered.result.current.setRowList;
    act(() => {
      prevFunc(generatePostList(100).map(post => ({ id: post.id, row: post })));
    });
    rendered.rerender();
    expect(prevFunc).toBe(rendered.result.current.setRowList);
  });
});

describe('patch row list', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const prevFunc = rendered.result.current.patchRowList;
    act(() => {
      prevFunc(generatePostList(100).map(post => ({ id: post.id, row: post })));
    });
    rendered.rerender();
    expect(prevFunc).toBe(rendered.result.current.patchRowList);
  });
});

describe('delete row list', () => {
  test('func does not rerender', () => {
    const { rendered } = build();
    const prevFunc = rendered.result.current.deleteRowList;
    act(() => {
      rendered.result.current.setRowList(
        generatePostList(100).map(post => ({ id: post.id, row: post })),
      );
    });
    rendered.rerender();
    expect(prevFunc).toBe(rendered.result.current.deleteRowList);
  });
});
