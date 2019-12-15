import DatabaseHookContext from '../../src/contexts/DatabaseHookContext';
import React, { ReactNode } from 'react';
import { DatabaseHook } from '../../src/hooks/useDatabase';

export const makeWrapper = (databaseHook: DatabaseHook) => ({
  children,
}: {
  children: ReactNode;
}) => (
  <DatabaseHookContext.Provider value={databaseHook}>
    {children}
  </DatabaseHookContext.Provider>
);
