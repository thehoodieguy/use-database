import { useState } from 'react';

function useDatabase(): boolean {
  const [value] = useState(true);

  return value;
}

export default useDatabase;
