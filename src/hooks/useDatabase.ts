import { useState } from 'react';

import { Database, RowUpdateArg, RowPatchArg } from '../types';
import { Table, TableKeyType } from './../types';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const getTable = <RowType>(tableName: string): Table<RowType> =>
    database[tableName];

  const dropTable = (tableName: string): void => {
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

  const getRow = <RowType>(tableName: string, id: TableKeyType): RowType =>
    database[tableName][id];

  const patchRow = <RowType>(
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

  const deleteRow = (tableName: string, id: TableKeyType): void => {
    const { [id]: omit, ...newTable } = database[tableName]; // eslint-disable-line @typescript-eslint/no-unused-vars
    setDatabase({
      ...database,
      [tableName]: newTable,
    });
  };

  const getRowList = <RowType>(
    tableName: string,
    idList: TableKeyType[],
  ): RowType[] => idList.map(id => database[tableName][id]);

  const deleteRowList = (tableName: string, idList: TableKeyType[]): void => {
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
  getRowList: <RowType>(tableName: string, idList: TableKeyType[]) => RowType[];
  deleteRowList: (tableName: string, idList: TableKeyType[]) => void;
  setRowList: <RowType>(
    tableName: string,
    rowListToUpdate: RowUpdateArg<RowType>[],
  ) => void;
  patchRowList: <RowType>(
    tableName: string,
    rowListToPatch: RowPatchArg<RowType>[],
  ) => void;
}

export default useDatabase;
