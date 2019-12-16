import { useState, useCallback } from 'react';

import { Database, RowUpdateArg, RowPatchArg } from '../types';
import { TableKeyType } from './../types';

function useDatabase(): DatabaseHook {
  const [database, setDatabase] = useState<Database>({});

  const setRow = useCallback(
    <RowType>(
      tableName: string,
      id: TableKeyType,
      data: RowType,
    ): TableKeyType => {
      setDatabase(database => ({
        ...database,
        [tableName]: {
          ...database[tableName],
          [id]: data,
        },
      }));
      return id;
    },
    [],
  );

  const getRow = useCallback(
    <RowType>(tableName: string, id: TableKeyType): RowType | undefined => {
      if (!(tableName in database)) {
        return undefined;
      }
      return database[tableName][id];
    },
    [database],
  );

  const patchRow = useCallback(
    <RowType>(
      tableName: string,
      id: TableKeyType,
      partialData: Partial<RowType>,
    ): TableKeyType => {
      setDatabase(database => ({
        ...database,
        [tableName]: {
          ...database[tableName],
          [id]: {
            ...(tableName in database ? database[tableName][id] : {}),
            ...partialData,
          },
        },
      }));
      return id;
    },
    [],
  );

  const deleteRow = useCallback((tableName: string, id: TableKeyType): void => {
    setDatabase(database => {
      if (!(tableName in database)) {
        return database;
      }
      const { [id]: omit, ...newTable } = database[tableName]; // eslint-disable-line @typescript-eslint/no-unused-vars
      return {
        ...database,
        [tableName]: newTable,
      };
    });
  }, []);

  const getRowList = useCallback(
    <RowType>(
      tableName: string,
      idList: TableKeyType[],
    ): (RowType | undefined)[] => {
      if (!(tableName in database)) {
        return idList.map(() => undefined);
      }
      return idList.map(id => database[tableName][id]);
    },
    [database],
  );

  const deleteRowList = useCallback(
    (tableName: string, idList: TableKeyType[]): void => {
      setDatabase(database => {
        if (!(tableName in database)) {
          return database;
        }
        const strIdList = idList.map(id => id.toString());
        const newTable = Object.fromEntries(
          Object.entries(database[tableName]).filter(
            ([id]) => strIdList.findIndex(idToRemove => idToRemove === id) < 0,
          ),
        );
        return {
          ...database,
          [tableName]: newTable,
        };
      });
    },
    [],
  );

  const setRowList = useCallback(
    <RowType>(
      tableName: string,
      rowListToUpdate: RowUpdateArg<RowType>[],
    ): TableKeyType[] => {
      const newPartialTable = Object.fromEntries(
        rowListToUpdate.map(({ id, row }) => [id, row]),
      );
      setDatabase(database => ({
        ...database,
        [tableName]: {
          ...database[tableName],
          ...newPartialTable,
        },
      }));
      return rowListToUpdate.map(arg => arg.id);
    },
    [],
  );

  const patchRowList = useCallback(
    <RowType>(
      tableName: string,
      rowListToPatch: RowPatchArg<RowType>[],
    ): TableKeyType[] => {
      setDatabase(database => {
        const partialNewTable =
          tableName in database
            ? Object.fromEntries(
                rowListToPatch.map(({ id, row }) => [
                  id,
                  { ...database[tableName][id], ...row },
                ]),
              )
            : Object.fromEntries(
                rowListToPatch.map(({ id, row }) => [id, row]),
              );

        return {
          ...database,
          [tableName]: { ...database[tableName], ...partialNewTable },
        };
      });
      return rowListToPatch.map(arg => arg.id);
    },
    [],
  );

  return {
    database,
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
