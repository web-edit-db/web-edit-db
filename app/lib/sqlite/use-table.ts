import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'
import { getTableSchema } from './queries'

export const useTable = (tableName: string) => {
  const { database } = useSqliteContext()

  const result = useMemo(() => {
    if (!database) return null
    return getTableSchema(database, tableName)
  }, [database, tableName])

  return result
}
