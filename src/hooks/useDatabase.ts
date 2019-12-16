import { useState } from 'react';

import { Database, RowUpdateArg, RowPatchArg } from '../types';
import { Table, TableKeyType } from './../types';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const getTable = <RowType>(tableName: string): Table<RowType> => {
    if (!(tableName in database)) {
      setDatabase({
        ...database,
        [tableName]: {},
      });
      return {};
    }
    return database[tableName];
  };

  const setRow = <RowType>(
    tableName: string,
    id: TableKeyType,
    data: RowType,
  ): TableKeyType => {
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        [id]: data,
      },
    });
    return id;
  };

  const getRow = <RowType>(
    tableName: string,
    id: TableKeyType,
  ): RowType | undefined => {
    if (!(tableName in database)) {
      return undefined;
    }
    return database[tableName][id];
  };

  const patchRow = <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ): TableKeyType => {
    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        [id]: {
          ...(tableName in database ? database[tableName][id] : {}),
          ...partialData,
        },
      },
    });
    return id;
  };

  const deleteRow = (tableName: string, id: TableKeyType): void => {
    if (!(tableName in database)) {
      setDatabase({
        ...database,
        [tableName]: {},
      });
      return;
    }
    const { [id]: omit, ...newTable } = database[tableName]; // eslint-disable-line @typescript-eslint/no-unused-vars
    setDatabase({
      ...database,
      [tableName]: newTable,
    });
  };

  const getRowList = <RowType>(
    tableName: string,
    idList: TableKeyType[],
  ): (RowType | undefined)[] => {
    if (!(tableName in database)) {
      return idList.map(() => undefined);
    }
    return idList.map(id => database[tableName][id]);
  };

  const deleteRowList = (tableName: string, idList: TableKeyType[]): void => {
    if (!(tableName in database)) {
      setDatabase({
        ...database,
        [tableName]: {},
      });
      return;
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
  ): TableKeyType[] => {
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
    return rowListToUpdate.map(arg => arg.id);
  };

  const patchRowList = <RowType>(
    tableName: string,
    rowListToPatch: RowPatchArg<RowType>[],
  ): TableKeyType[] => {
    const partialNewTable =
      tableName in database
        ? Object.fromEntries(
            rowListToPatch.map(({ id, row }) => [
              id,
              { ...database[tableName][id], ...row },
            ]),
          )
        : Object.fromEntries(rowListToPatch.map(({ id, row }) => [id, row]));

    setDatabase({
      ...database,
      [tableName]: {
        ...database[tableName],
        ...partialNewTable,
      },
    });
    return rowListToPatch.map(arg => arg.id);
  };

  return {
    database,
    getTable,
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
  getRow: <RowType>(tableName: string, id: TableKeyType) => RowType | undefined;
  deleteRow: (tableName: string, id: TableKeyType) => void;
  setRow: <RowType>(
    tableName: string,
    id: TableKeyType,
    data: RowType,
  ) => TableKeyType;
  patchRow: <RowType>(
    tableName: string,
    id: TableKeyType,
    partialData: Partial<RowType>,
  ) => TableKeyType;
  getRowList: <RowType>(
    tableName: string,
    idList: TableKeyType[],
  ) => (RowType | undefined)[];
  deleteRowList: (tableName: string, idList: TableKeyType[]) => void;
  setRowList: <RowType>(
    tableName: string,
    rowListToUpdate: RowUpdateArg<RowType>[],
  ) => TableKeyType[];
  patchRowList: <RowType>(
    tableName: string,
    rowListToPatch: RowPatchArg<RowType>[],
  ) => TableKeyType[];
}

export default useDatabase;
