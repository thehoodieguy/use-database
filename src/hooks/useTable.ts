import { TableKeyType, RowUpdateArg } from './../types';
import { useDatabaseHook } from '../contexts';

function useTable<RowType>(tableName: string): TableHook<RowType> {
  const {
    getRow: getRowFromDb,
    deleteRow: deleteRowFromDb,
    setRow: setRowToDb,
    patchRow: patchRowToDb,
    getRowList: getRowListFromDb,
    deleteRowList: deleteRowListFromDb,
    setRowList: setRowListToDb,
    patchRowList: patchRowListToDb,
  } = useDatabaseHook();

  const getRow = (id: TableKeyType) => getRowFromDb<RowType>(tableName, id);
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
  getRow: (id: TableKeyType) => RowType | undefined;
  setRow: (id: TableKeyType, row: RowType) => TableKeyType;
  patchRow: (id: TableKeyType, partialRow: Partial<RowType>) => TableKeyType;
  deleteRow: (id: TableKeyType) => void;
  getRowList: (idList: TableKeyType[]) => (RowType | undefined)[];
  deleteRowList: (idList: TableKeyType[]) => void;
  setRowList: (rowListToUpdate: RowUpdateArg<RowType>[]) => TableKeyType[];
  patchRowList: (rowListToPatch: RowUpdateArg<RowType>[]) => TableKeyType[];
}

export default useTable;
