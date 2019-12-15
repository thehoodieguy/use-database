import { useState } from 'react';

import { Database } from '../types';
import {
  TableDoesNotExists,
  TableExists,
  RowDoesNotExists,
} from './../exceptions';
import { Table, TableKeyType } from './../types';
import { checkTable, checkRow } from '../services';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const createTable = (tableName: string, check = true): void => {
    if (check) {
      if (tableName in database) {
        throw new TableExists(`Table ${tableName} already exists.`);
      }
    }
    setDatabase({ ...database, [tableName]: {} });
  };

  const getTable = <RowType>(
    tableName: string,
    check = true,
  ): Table<RowType> => {
    if (check) {
      checkTable(database, tableName);
    }
    return database[tableName];
  };

  const dropTable = (tableName: string, check = true): void => {
    if (check) {
      checkTable(database, tableName);
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

  const getData = <RowType>(
    tableName: string,
    id: TableKeyType,
    check = true,
  ): RowType => {
    if (check) {
      checkTable(database, tableName);
      checkRow(database[tableName], id);
    }
    return database[tableName][id];
  };

  const patchData = <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
    check = true,
  ): void => {
    if (check) {
      checkRow(getTable(tableName), id);
    }
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
    patchData,
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
  patchData: <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ) => void;
  getData: <RowType>(tableName: string, id: TableKeyType) => RowType;
}

export default useDatabase;
