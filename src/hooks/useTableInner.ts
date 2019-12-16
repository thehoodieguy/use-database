import { TableKeyType, RowUpdateArg } from '../types';
import { useCallback } from 'react';
import { DatabaseHook } from './useDatabase';

function useTableInner<RowType>({
  databaseHook,
  tableName,
}: UseTableInnerProps): TableHook<RowType> {
  const {
    getRow: getRowFromDb,
    deleteRow: deleteRowFromDb,
    setRow: setRowToDb,
    patchRow: patchRowToDb,
    getRowList: getRowListFromDb,
    deleteRowList: deleteRowListFromDb,
    setRowList: setRowListToDb,
    patchRowList: patchRowListToDb,
  } = databaseHook;

  const getRow = useCallback(
    (id: TableKeyType) => getRowFromDb<RowType>(tableName, id),
    [getRowFromDb, tableName],
  );
  const setRow = useCallback(
    (id: TableKeyType, row: RowType) => setRowToDb<RowType>(tableName, id, row),
    [setRowToDb, tableName],
  );
  const patchRow = useCallback(
    (id: TableKeyType, partialRow: Partial<RowType>) =>
      patchRowToDb<RowType>(tableName, id, partialRow),
    [patchRowToDb, tableName],
  );
  const deleteRow = useCallback(
    (id: TableKeyType): void => deleteRowFromDb(tableName, id),
    [deleteRowFromDb, tableName],
  );
  const getRowList = useCallback(
    (idList: TableKeyType[]) => getRowListFromDb<RowType>(tableName, idList),
    [getRowListFromDb, tableName],
  );
  const deleteRowList = useCallback(
    (idList: TableKeyType[]) => deleteRowListFromDb(tableName, idList),
    [deleteRowListFromDb, tableName],
  );
  const setRowList = useCallback(
    (rowListToUpdate: RowUpdateArg<RowType>[]) =>
      setRowListToDb(tableName, rowListToUpdate),
    [setRowListToDb, tableName],
  );
  const patchRowList = useCallback(
    (rowListToPatch: RowUpdateArg<RowType>[]) =>
      patchRowListToDb(tableName, rowListToPatch),
    [patchRowListToDb, tableName],
  );

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

export interface UseTableInnerProps {
  databaseHook: DatabaseHook;
  tableName: string;
}

export interface TableHook<RowType> {
  getRow: (id: TableKeyType) => RowType | undefined;
  setRow: (id: TableKeyType, row: RowType) => TableKeyType;
  patchRow: (id: TableKeyType, partialRow: Partial<RowType>) => TableKeyType;
  deleteRow: (id: TableKeyType) => void;
  getRowList: (idList: TableKeyType[]) => (RowType | undefined)[];
  deleteRowList: (idList: TableKeyType[]) => void;
  setRowList: (rowListToUpdate: RowUpdateArg<RowType>[]) => TableKeyType[];
  patchRowList: (rowListToPatch: RowUpdateArg<RowType>[]) => TableKeyType[];
}

export default useTableInner;
