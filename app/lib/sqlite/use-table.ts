import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'
import { getTableSchema, getTableTree } from './queries'

export const useTable = (tableName: string) => {
  const { database } = useSqliteContext()

  const result = useMemo(() => {
    if (!database) return []
    return getTableSchema(database, tableName)
  }, [database, tableName])

  return result
}

export const useTableTree = () => {
  const { database } = useSqliteContext()

  const result = useMemo(() => {
    if (!database) return {}
    return getTableTree(database)
  }, [database])

  return result
}
