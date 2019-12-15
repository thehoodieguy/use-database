import { DatabaseHook } from '../hooks/useDatabase';
import { createContext, useContext } from 'react';
import { DatabaseNotProvidedError } from '../exceptions';

const DatabaseHookContext = createContext<DatabaseHook | null>(null);

export const useDatabaseHook = (): DatabaseHook => {
  const databaseStore = useContext(DatabaseHookContext);
  if (databaseStore == null) {
    throw new DatabaseNotProvidedError('DatabaseContext is provided.');
  }
  return databaseStore;
};

const DatabaseHookProvider = DatabaseHookContext.Provider;

export default DatabaseHookProvider;
