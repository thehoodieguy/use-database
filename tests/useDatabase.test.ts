import { renderHook } from '@testing-library/react-hooks';

import useDatabase from '../src/hooks/useDatabase';

test('hook work', () => {
  const { result } = renderHook(() => useDatabase());
  expect(result.current).toBe(true);
});
