import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import initSqlJs from 'sql.js'
import type { SqlJsStatic, Database } from 'sql.js'

export type NamedDatabase = {
  database: Database
  fileName: string
}

type SqliteContextType = {
  sqlite3: SqlJsStatic | null
  database: NamedDatabase | null
  isLoading: boolean
  setDatabase: (database: NamedDatabase | null) => void
}

const SqliteContext = createContext<SqliteContextType | null>(null)

export function SqliteProvider({ children }: { children: ReactNode }) {
  const [sqlite3, setSqlite3] = useState<SqlJsStatic | null>(null)
  const [database, setDatabase] = useState<NamedDatabase | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
        throw error
      }
    }

    initSqlite()

    return () => {
      if (database?.database) {
        database.database.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setDatabaseAndClosePrevious = useCallback(
    (newDatabase: NamedDatabase | null) => {
      if (database?.database) {
        database.database.close()
      }
      setDatabase(newDatabase)
    },
    [database],
  )

  const value = useMemo(() => {
    return {
      sqlite3,
      database,
      isLoading,
      setDatabase: setDatabaseAndClosePrevious,
    } satisfies SqliteContextType
  }, [sqlite3, database, isLoading, setDatabaseAndClosePrevious])

  return <SqliteContext.Provider value={value}>{children}</SqliteContext.Provider>
}

export const useSqliteContext = () => {
  const context = useContext(SqliteContext)
  if (!context) {
    throw new Error('useSqliteContext must be used within a SqliteProvider')
  }
  return context
}
