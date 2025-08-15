import { useCallback, useMemo, useState } from 'react'
import { fileOpen } from 'browser-fs-access'
import { useSqliteContext } from './SqliteProvider'

export const useDatabase = () => {
  const { sqlite3, database, isLoading: sqliteLoading, setDatabase } = useSqliteContext()
  const [isOperationLoading, setIsOperationLoading] = useState(false)

  const databaseOpened = useMemo(() => {
    if (!sqlite3) {
      return false
    }
    return database !== null
  }, [sqlite3, database])

  const databaseName = useMemo(() => {
    if (!database) {
      return null
    }
    return database.fileName
  }, [database])

  const isLoading = useMemo(() => {
    return sqliteLoading || isOperationLoading
  }, [sqliteLoading, isOperationLoading])

  const createDatabase = useCallback(
    async (filename: string = 'database.db', overwrite = false) => {
      if (!sqlite3) {
        throw new Error('SQLite is not initialized')
      }

      if (databaseOpened && !overwrite) {
        throw new Error('Database already opened')
      }

      setIsOperationLoading(true)
      try {
        const database = new sqlite3.Database()
        setDatabase({ database, fileName: filename })
        return database
      } finally {
        setIsOperationLoading(false)
      }
    },
    [sqlite3, databaseOpened, setDatabase],
  )

  const openDatabase = useCallback(
    async (overwrite = false) => {
      if (!sqlite3) {
        throw new Error('SQLite is not initialized')
      }

      if (databaseOpened && !overwrite) {
        throw new Error('Database already opened')
      }

      setIsOperationLoading(true)
      try {
        const databaseBlob = await fileOpen({
          description: 'Select a database file',
          mimeTypes: ['application/vnd.sqlite3', 'application/x-sqlite3'],
        })
        const databaseBufferArray = new Uint8Array(await databaseBlob.arrayBuffer())

        const database = new sqlite3.Database(databaseBufferArray)
        setDatabase({ database, fileName: databaseBlob.name })
        return database
      } finally {
        setIsOperationLoading(false)
      }
    },
    [sqlite3, databaseOpened, setDatabase],
  )

  return { createDatabase, openDatabase, databaseOpened, databaseName, isLoading }
}
