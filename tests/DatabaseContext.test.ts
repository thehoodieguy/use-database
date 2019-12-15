import { renderHook } from '@testing-library/react-hooks';
import { useDatabaseHook } from '../src/contexts/DatabaseHookContext';
import useDatabase from '../src/hooks/useDatabase';
import { makeWrapper } from './utils/context';
import { DatabaseNotProvidedError } from '../src/exceptions';

describe('database context', () => {
  test('use database hook', () => {
    const renderedDatabase = renderHook(() => useDatabase());
    const rendered = renderHook(() => useDatabaseHook(), {
      wrapper: makeWrapper(renderedDatabase.result.current),
    });
    expect(rendered.result.current).toBeTruthy();
  });

  test('use database hook when not provided', () => {
    const rendered = renderHook(() => useDatabaseHook());
    expect(() => rendered.result.current).toThrowError(
      DatabaseNotProvidedError,
    );
  });
});
