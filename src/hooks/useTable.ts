import { TableKeyType } from './../types';
import { TableExists } from './../exceptions';
import { useDatabaseHook } from './../contexts/DatabaseContext';
import { useEffect } from 'react';

function useTable<RowType>({ tableName }: TableProps): TableHook<RowType> {
  const {
    createTable,
    getData: getDataFromDatabase,
    setData: setDataToDb,
    updateData: updateDataToDb,
  } = useDatabaseHook();

  useEffect(() => {
    try {
      createTable(tableName);
    } catch (e) {
      if (!(e instanceof TableExists)) throw e;
    }
  }, []);

  const getData = (id: string | number): RowType => {
    return getDataFromDatabase<RowType>(tableName, id);
  };
  const setData = (id: string | number, data: RowType): void => {
    setDataToDb<RowType>(tableName, id, data);
  };
  const updateData = (
    id: TableKeyType,
    partialData: Partial<RowType>,
  ): void => {
    updateDataToDb<RowType>(tableName, id, partialData);
  };

  return {
    getData,
    setData,
    updateData,
  };
}

export interface TableProps {
  tableName: string;
}

export interface TableHook<RowType> {
  getData: (id: TableKeyType) => RowType;
  setData: (id: TableKeyType, data: RowType) => void;
  updateData: (id: TableKeyType, partialData: Partial<RowType>) => void;
}

export default useTable;
