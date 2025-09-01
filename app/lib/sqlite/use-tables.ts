import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'
import { getTableNames } from './queries'

export const useTables = () => {
  const { database } = useSqliteContext()

  const tables = useMemo(() => {
    if (!database) return []
    return getTableNames(database)
  }, [database])

  return {
    tables,
  }
}
