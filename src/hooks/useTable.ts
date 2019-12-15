import { TableKeyType, Database } from './../types';
import { TableExists } from './../exceptions';
import { useDatabaseHook } from '../contexts/DatabaseHookContext';
import { useEffect } from 'react';

function useTable<RowType>(tableName: string): TableHook<RowType> {
  const {
    database,
    createTable,
    getRow: getRowFromDb,
    deleteRow: deleteRowFromDb,
    setRow: setRowToDb,
    patchRow: patchRowToDb,
  } = useDatabaseHook();

  useEffect(() => {
    try {
      createTable(tableName);
    } catch (e) {
      if (!(e instanceof TableExists)) throw e;
    }
  }, []);

  const getRow = (id: TableKeyType): RowType => {
    return getRowFromDb<RowType>(tableName, id);
  };
  const setRow = (id: TableKeyType, row: RowType): void => {
    setRowToDb<RowType>(tableName, id, row);
  };
  const patchRow = (id: TableKeyType, partialRow: Partial<RowType>): void => {
    patchRowToDb<RowType>(tableName, id, partialRow);
  };
  const deleteRow = (id: TableKeyType): void => {
    deleteRowFromDb(tableName, id);
  };

  return {
    database,
    getRow,
    setRow,
    patchRow,
    deleteRow,
  };
}

export interface TableHook<RowType> {
  database: Database;
  getRow: (id: TableKeyType) => RowType;
  setRow: (id: TableKeyType, row: RowType) => void;
  patchRow: (id: TableKeyType, partialRow: Partial<RowType>) => void;
  deleteRow: (id: TableKeyType) => void;
}

export default useTable;
