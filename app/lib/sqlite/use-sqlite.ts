import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'

export const useSqlite = () => {
  const { sqlite3, database, isLoading, error } = useSqliteContext()

  const isReady = useMemo(() => {
    return !isLoading && !error && sqlite3 !== null && database !== null
  }, [isLoading, error, sqlite3, database])

  return {
    sqlite3,
    database,
    isLoading,
    error,
    isReady,
  }
}
