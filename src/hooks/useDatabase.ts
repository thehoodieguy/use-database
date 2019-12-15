import { useState } from 'react';

import { Database, RowUpdateArg, RowPatchArg } from '../types';
import { TableExists } from './../exceptions';
import { Table, TableKeyType } from './../types';
import {
  checkTable as checkTableUtil,
  checkRow as checkRowUtil,
} from './utils';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const createTable = (tableName: string): void => {
    if (tableName in database) {
      throw new TableExists(`Table ${tableName} already exists.`);
    }
    setDatabase({ ...database, [tableName]: {} });
  };

  const checkTable = (tableName: string) => {
    checkTableUtil(database, tableName);
  };

  const checkRow = (tableName: string, id: TableKeyType) => {
    checkRowUtil(database[tableName], id);
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
    checkTable(tableName);
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
    checkRow(tableName, id);
    return database[tableName][id];
  };

  const patchRow = <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ): void => {
    checkTable(tableName);
    checkRow(tableName, id);
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

  const deleteRow = (tableName: string, id: TableKeyType): void => {
    checkTable(tableName);
    checkRow(tableName, id);
    const { [id]: omit, ...newTable } = database[tableName];
    setDatabase({
      ...database,
      [tableName]: newTable,
    });
  };

  const getRowList = <RowType>(
    tableName: string,
    idList: TableKeyType[],
    checkIdList = false,
  ): RowType[] => {
    checkTable(tableName);
    if (checkIdList) {
      idList.map(id => checkRow(tableName, id));
    }
    return idList.map(id => database[tableName][id]);
  };

  const deleteRowList = (
    tableName: string,
    idList: TableKeyType[],
    checkIdList = false,
  ): void => {
    checkTable(tableName);
    if (checkIdList) {
      idList.map(id => checkRow(tableName, id));
    }
    const strIdList = idList.map(id => id.toString());
    const newTable = Object.fromEntries(
      Object.entries(database[tableName]).filter(
        ([id]) => strIdList.findIndex(idToRemove => idToRemove === id) < 0,
      ),
    );

    setDatabase({
      ...database,
      [tableName]: newTable,
    });
  };

  const setRowList = <RowType>(
    tableName: string,
    rowListToUpdate: RowUpdateArg<RowType>[],
  ): void => {
    checkTable(tableName);
    const newPartialTable = Object.fromEntries(
      rowListToUpdate.map(({ id, row }) => [id, row]),
    );
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        ...newPartialTable,
      },
    });
  };

  const patchRowList = <RowType>(
    tableName: string,
    rowListToPatch: RowPatchArg<RowType>[],
  ): void => {
    checkTable(tableName);
    const partialNewTable = Object.fromEntries(
      rowListToPatch.map(({ id, row }) => [
        id,
        { ...database[tableName][id], ...row },
      ]),
    );
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        ...partialNewTable,
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
    deleteRow,
    getRowList,
    deleteRowList,
    setRowList,
    patchRowList,
  };
}

export interface DatabaseHook {
  database: Database;
  checkTable: (tableName: string) => void;
  createTable: (tableName: string) => void;
  getTable: <RowType>(tableName: string) => Table<RowType>;
  dropTable: (tableName: string) => void;
  getRow: <RowType>(tableName: string, id: TableKeyType) => RowType;
  deleteRow: (tableName: string, id: TableKeyType) => void;
  setRow: <RowType>(tableName: string, id: TableKeyType, data: RowType) => void;
  patchRow: <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ) => void;
  getRowList: <RowType>(
    tableName: string,
    idList: TableKeyType[],
    checkIdList?: boolean,
  ) => RowType[];
  deleteRowList: (
    tableName: string,
    idList: TableKeyType[],
    checkIdList?: boolean,
  ) => void;
  setRowList: <RowType>(
    tableName: string,
    rowsToUpdate: RowUpdateArg<RowType>[],
    checkRowList?: boolean,
  ) => void;
  patchRowList: <RowType>(
    tableName: string,
    rowsToUpdate: RowPatchArg<RowType>[],
    checkRowList?: boolean,
  ) => void;
}

export default useDatabase;
