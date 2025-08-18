import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import initSqlJs from 'sql.js'
import type { SqlJsStatic } from 'sql.js'
import { toast } from 'sonner'
import { Database } from '@/lib/sqlite/database'

type SqliteContextType = {
  sqlite3: SqlJsStatic | null
  database: Database | null
  isLoading: boolean
  error: string | null
  setDatabase: (database: Database | null) => void
}

const SqliteContext = createContext<SqliteContextType | null>(null)

export function SqliteProvider({ children }: { children: ReactNode }) {
  const [sqlite3, setSqlite3] = useState<SqlJsStatic | null>(null)
  const [database, setDatabase] = useState<Database | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initSqlite = async () => {
      try {
        const sqlite3 = await initSqlJs({
          locateFile: () => {
            return `/sqlite3.wasm`
          },
        })
        setSqlite3(sqlite3)
        setIsLoading(false)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize SQLite'
        setError(errorMessage)
        setIsLoading(false)
        toast.error('SQLite Engine Failed', {
          description: errorMessage,
        })
        console.error('SQLite initialization failed:', error)
      }
    }

    initSqlite()
  }, [])

  const value = useMemo(() => {
    return {
      sqlite3,
      database,
      isLoading,
      error,
      setDatabase,
    } satisfies SqliteContextType
  }, [sqlite3, database, isLoading, error, setDatabase])

  return <SqliteContext.Provider value={value}>{children}</SqliteContext.Provider>
}

export const useSqliteContext = () => {
  const context = useContext(SqliteContext)
  if (!context) {
    throw new Error('useSqliteContext must be used within a SqliteProvider')
  }
  return context
}
