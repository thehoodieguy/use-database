import { useDatabaseHook } from '../contexts';
import useTableInner, { TableHook } from './useTableInner';

function useTable<RowType>(tableName: string): TableHook<RowType> {
  const databaseHook = useDatabaseHook();
  return useTableInner<RowType>({ databaseHook, tableName });
}

export default useTable;
