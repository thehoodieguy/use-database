import { TableKeyType, Database, RowUpdateArg } from './../types';
import { TableExists } from './../exceptions';
import { useDatabaseHook } from '../contexts/DatabaseHookContext';
import { useEffect } from 'react';

function useTable<RowType>(tableName: string): TableHook<RowType> {
  const {
    createTable,
    getRow: getRowFromDb,
    deleteRow: deleteRowFromDb,
    setRow: setRowToDb,
    patchRow: patchRowToDb,
    getRowList: getRowListFromDb,
    deleteRowList: deleteRowListFromDb,
    setRowList: setRowListToDb,
    patchRowList: patchRowListToDb,
  } = useDatabaseHook();

  useEffect(() => {
    try {
      createTable(tableName);
    } catch (e) {
      if (!(e instanceof TableExists)) throw e;
    }
  }, []);

  const getRow = (id: TableKeyType): RowType =>
    getRowFromDb<RowType>(tableName, id);
  const setRow = (id: TableKeyType, row: RowType) =>
    setRowToDb<RowType>(tableName, id, row);
  const patchRow = (id: TableKeyType, partialRow: Partial<RowType>) =>
    patchRowToDb<RowType>(tableName, id, partialRow);
  const deleteRow = (id: TableKeyType): void => deleteRowFromDb(tableName, id);
  const getRowList = (idList: TableKeyType[]) =>
    getRowListFromDb<RowType>(tableName, idList);
  const deleteRowList = (idList: TableKeyType[]) =>
    deleteRowListFromDb(tableName, idList);
  const setRowList = (rowListToUpdate: RowUpdateArg<RowType>[]) =>
    setRowListToDb(tableName, rowListToUpdate);
  const patchRowList = (rowListToPatch: RowUpdateArg<RowType>[]) =>
    patchRowListToDb(tableName, rowListToPatch);

  return {
    getRow,
    setRow,
    patchRow,
    deleteRow,
    getRowList,
    deleteRowList,
    setRowList,
    patchRowList,
  };
}

export interface TableHook<RowType> {
  getRow: (id: TableKeyType) => RowType;
  setRow: (id: TableKeyType, row: RowType) => void;
  patchRow: (id: TableKeyType, partialRow: Partial<RowType>) => void;
  deleteRow: (id: TableKeyType) => void;
  getRowList: (idList: TableKeyType[]) => RowType[];
  deleteRowList: (idList: TableKeyType[]) => void;
  setRowList: (rowListToUpdate: RowUpdateArg<RowType>[]) => void;
  patchRowList: (rowListToPatch: RowUpdateArg<RowType>[]) => void;
}

export default useTable;
