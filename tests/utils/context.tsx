import DatabaseHookProvider from '../../src/contexts';
import React, { ReactNode } from 'react';
import { DatabaseHook } from '../../src/hooks/useDatabase';

export const makeWrapper = (databaseHook: DatabaseHook) => ({
  children,
}: {
  children?: ReactNode;
}) => (
  <DatabaseHookProvider value={databaseHook}>{children}</DatabaseHookProvider>
);
