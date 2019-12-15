import { Database, TableKeyType, Table } from '../types';
import { TableDoesNotExist, RowDoesNotExist } from '../exceptions';

export const checkTable = (database: Database, tableName: string) => {
  if (!(tableName in database)) {
    throw new TableDoesNotExist(`Table ${tableName} does not exist.`);
  }
};

export const checkRow = (table: Table<any>, id: TableKeyType) => {
  if (!(id in table)) {
    throw new RowDoesNotExist(`Row with id ${id} does not exist.`);
  }
};
