import { useState } from 'react';

import { Database } from '../types';
import { TableDoesNotExists, TableExists } from './../exceptions';
import { Table, TableKeyType } from './../types';

function useDatabase(): DatabaseHook {
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

  const setData = <RowType>(
    tableName: string,
    id: TableKeyType,
    data: RowType,
  ): void => {
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        [id]: data,
      },
    });
  };

  const getData = <RowType>(tableName: string, id: TableKeyType): RowType => {
    return database[tableName][id];
  };

  const updateData = <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ): void => {
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        [id]: {
          ...database[tableName][id],
          ...partialData,
        },
      },
    });
  };

  return {
    database,
    createTable,
    getTable,
    dropTable,
    setData,
    getData,
    updateData,
  };
}

export interface DatabaseHook {
  database: Database;
  createTable: (tableName: string) => void;
  getTable: <RowType>(tableName: string) => Table<RowType>;
  dropTable: (tableName: string) => void;
  setData: <RowType>(
    tableName: string,
    id: TableKeyType,
    data: RowType,
  ) => void;
  updateData: <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ) => void;
  getData: <RowType>(tableName: string, id: TableKeyType) => RowType;
}

export default useDatabase;
