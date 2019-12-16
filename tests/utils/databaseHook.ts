import { act, RenderHookResult } from '@testing-library/react-hooks';
import randomstring from 'randomstring';
import { DatabaseHook } from '../../src/hooks/useDatabase';
import { generatePostList } from './mock';

export const setTableWithRowsUtil = (
  rendered: RenderHookResult<void, DatabaseHook>,
  rowNum = 100,
) => {
  const tableName = randomstring.generate();
  const postList = generatePostList(rowNum);
  act(() => {
    rendered.result.current.setRowList(
      tableName,
      postList.map(post => ({ id: post.id, row: post })),
    );
  });
  return { tableName, postList };
};
