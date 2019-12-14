export type Table<RowType> = Record<string | number, RowType>;
export type Database = Record<string, Table<any>>;
