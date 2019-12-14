import { useState } from 'react';

import { Database } from '../types';
import { TableDoesNotExists, TableExists } from './../exceptions';
import { Table } from './../types';

function useDatabase(): UseDatabaseResult {
  const [database, setDatabase] = useState<Database>({});

  const createTable = (tableName: string): void => {
    if (tableName in database) {
      throw new TableExists(`Table ${tableName} already exists.`);
    }
    setDatabase({ ...database, [tableName]: {} });
  };

  const getTable = <RowType>(tableName: string): Table<RowType> => {
    if (!(tableName in database)) {
      throw new TableDoesNotExists(`Table ${tableName} does not exist.`);
    }
    return database[tableName];
  };

  const dropTable = (tableName: string): void => {
    if (!(tableName in database)) {
      throw new TableDoesNotExists(`Table ${tableName} does not exist.`);
    }
    const { [tableName]: omit, ...dropped } = database; // eslint-disable-line @typescript-eslint/no-unused-vars
    setDatabase(dropped);
  };

  return {
    database,
    createTable,
    getTable,
    dropTable,
  };
}

export interface UseDatabaseResult {
  database: Database;
  createTable: (tableName: string) => void;
  getTable: <RowType>(tableName: string) => Table<RowType>;
  dropTable: (tableName: string) => void;
}

export default useDatabase;
