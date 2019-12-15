import { makeWrapper } from './utils/context';
import useDatabase, { DatabaseHook } from '../src/hooks/useDatabase';
import {
  renderHook,
  act,
  RenderHookResult,
} from '@testing-library/react-hooks';
import useTable from '../src/hooks/useTable';
import { Post, generatePost } from './utils/mock';
import randomstring from 'randomstring';

const build = (mountOnce = true) => {
  const renderedDb = renderHook(() => useDatabase());
  const tableName = randomstring.generate();
  const renderTable = (renderedDb: RenderHookResult<void, DatabaseHook>) =>
    renderHook(() => useTable<Post>(tableName), {
      wrapper: makeWrapper(renderedDb.result.current),
    });
  if (mountOnce) {
    // mount once to trigger useMount hook (will init table)
    act(() => {
      renderTable(renderedDb);
    });
  }
  return {
    renderedDb,
    renderTable,
    tableName,
  };
};

describe('get row', () => {
  test('', () => {
    const { renderedDb, renderTable, tableName } = build();
    const samplePost = generatePost();
    act(() => {
      renderedDb.result.current.setRow(tableName, samplePost.id, samplePost);
    });
    const renderedTable = renderTable(renderedDb);
    expect(renderedTable.result.current.getRow(samplePost.id)).toEqual(
      samplePost,
    );
  });

  test('does not exist', () => {
    const { renderedDb, renderTable } = build();
    const samplePost = generatePost();
    const renderedTable = renderTable(renderedDb);
    expect(() => renderedTable.result.current.getRow(samplePost.id)).toThrow();
  });
});

describe('set row', () => {
  test('', () => {
    const { renderedDb, renderTable } = build();
    const samplePost = generatePost();
    let renderedTable = renderTable(renderedDb);
    act(() => {
      renderedTable.result.current.setRow(samplePost.id, samplePost);
    });
    renderedTable = renderTable(renderedDb);
    expect(renderedTable.result.current.getRow(samplePost.id)).toEqual(
      samplePost,
    );
  });

  test('already exists', () => {
    const { renderedDb, renderTable, tableName } = build();
    const samplePost = generatePost();
    act(() =>
      renderedDb.result.current.setRow(tableName, samplePost.id, samplePost),
    );
    const postAfter = {
      ...generatePost(),
      id: samplePost.id,
    };
    let renderedTable = renderTable(renderedDb);
    act(() => {
      renderedTable.result.current.setRow(postAfter.id, postAfter);
    });
    renderedTable = renderTable(renderedDb);
    expect(renderedTable.result.current.getRow(samplePost.id)).toEqual(
      postAfter,
    );
  });
});

describe('patch row', () => {
  test('', () => {
    const { renderedDb, renderTable, tableName } = build();
    const postBefore = generatePost();
    const postAfter: Partial<Post> = { body: generatePost().body };
    act(() =>
      renderedDb.result.current.setRow(tableName, postBefore.id, postBefore),
    );
    const renderedTable = renderTable(renderedDb);
    act(() => {
      renderedTable.result.current.patchRow(postBefore.id, postAfter);
    });
  });

  test('does not exist', () => {
    const { renderedDb, renderTable } = build();
    const postBefore = generatePost();
    const postAfter: Partial<Post> = { body: generatePost().body };
    const renderedTable = renderTable(renderedDb);
    expect(() =>
      act(() => {
        renderedTable.result.current.patchRow(postBefore.id, postAfter);
      }),
    );
  });
});

describe('delete row', () => {
  test('', () => {
    const { renderedDb, renderTable } = build();
    const post = generatePost();
    let renderedTable = renderTable(renderedDb);
    act(() => renderedTable.result.current.setRow(post.id, post));
    renderedTable = renderTable(renderedDb);
    act(() => renderedTable.result.current.deleteRow(post.id));
    renderedTable = renderTable(renderedDb);
    expect(renderedTable.result.current.getRow(post.id)).toBeFalsy();
  });

  test('does not exist', () => {
    const { renderedDb, renderTable } = build();
    const post = generatePost();
    const renderedTable = renderTable(renderedDb);
    expect(() =>
      act(() => renderedTable.result.current.deleteRow(post.id)),
    ).toThrow();
  });
});
