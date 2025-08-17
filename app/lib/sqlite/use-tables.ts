import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'

export const useTables = () => {
  const { database } = useSqliteContext()

  const tables = useMemo(() => {
    if (!database) return []
    return database.getTableNames()
  }, [database])

  return {
    tables,
  }
}
