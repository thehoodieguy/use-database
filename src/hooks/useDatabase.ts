import { useState } from 'react';

import { Database } from '../types';
import { TableExists } from './../exceptions';
import { Table, TableKeyType } from './../types';
import { checkTable as checkTableService, checkRow } from './utils';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const createTable = (tableName: string): void => {
    if (tableName in database) {
      throw new TableExists(`Table ${tableName} already exists.`);
    }
    setDatabase({ ...database, [tableName]: {} });
  };

  const checkTable = (tableName: string) => {
    checkTableService(database, tableName);
  };

  const getTable = <RowType>(
    tableName: string,
    check = true,
  ): Table<RowType> => {
    if (check) {
      checkTable(tableName);
    }
    return database[tableName];
  };

  const dropTable = (tableName: string): void => {
    checkTable(tableName);
    const { [tableName]: omit, ...dropped } = database; // eslint-disable-line @typescript-eslint/no-unused-vars
    setDatabase(dropped);
  };

  const setRow = <RowType>(
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

  const getRow = <RowType>(
    tableName: string,
    id: TableKeyType,
    check = true,
  ): RowType => {
    checkTable(tableName);
    checkRow(database[tableName], id);
    return database[tableName][id];
  };

  const patchRow = <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ): void => {
    checkRow(getTable(tableName), id);
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
    checkTable,
    createTable,
    getTable,
    dropTable,
    setRow,
    getRow,
    patchRow,
  };
}

export interface DatabaseHook {
  database: Database;
  checkTable: (tableName: string) => void;
  createTable: (tableName: string) => void;
  getTable: <RowType>(tableName: string) => Table<RowType>;
  dropTable: (tableName: string) => void;
  setRow: <RowType>(tableName: string, id: TableKeyType, data: RowType) => void;
  patchRow: <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ) => void;
  getRow: <RowType>(tableName: string, id: TableKeyType) => RowType;
}

export default useDatabase;
