import { Database, TableKeyType, Table } from './types';
import { TableDoesNotExists, RowDoesNotExists } from './exceptions';

export const checkTable = (database: Database, tableName: string) => {
  if (!(tableName in database)) {
    throw new TableDoesNotExists(`Table ${tableName} does not exist.`);
  }
};

export const checkRow = (table: Table<any>, id: TableKeyType) => {
  if (!(id in table)) {
    throw new RowDoesNotExists(`Row with id ${id} does not exist.`);
  }
};
