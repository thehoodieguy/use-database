import DatabaseHookProvider from '../../src/contexts/DatabaseHookContext';
import React, { ReactNode } from 'react';
import { DatabaseHook } from '../../src/hooks/useDatabase';

export const makeWrapper = (databaseHook: DatabaseHook) => ({
  children,
}: {
  children: ReactNode;
}) => (
  <DatabaseHookProvider value={databaseHook}>{children}</DatabaseHookProvider>
);
