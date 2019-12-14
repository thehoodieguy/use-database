export type TableKeyType = string | number;
export type Table<RowType> = Record<TableKeyType, RowType>;
export type Database = Record<string, Table<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
