import { useCallback, useMemo } from 'react'
import { fileOpen } from 'browser-fs-access'
import { useSqliteContext } from './SqliteProvider'

export const useDatabase = () => {
  const { sqlite3, database, setDatabase } = useSqliteContext()

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

  const createDatabase = useCallback(
    async (filename: string = 'database.db', overwrite = false) => {
      if (!sqlite3) {
        throw new Error('SQLite is not initialized')
      }

      if (databaseOpened && !overwrite) {
        throw new Error('Database already opened')
      }

      const database = new sqlite3.Database()
      setDatabase({ database, fileName: filename })
      return database
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

      const databaseBlob = await fileOpen({
        description: 'Select a database file',
        mimeTypes: ['application/vnd.sqlite3', 'application/x-sqlite3'],
      })
      const databaseBufferArray = new Uint8Array(await databaseBlob.arrayBuffer())

      const database = new sqlite3.Database(databaseBufferArray)
      setDatabase({ database, fileName: databaseBlob.name })
      return database
    },
    [sqlite3, databaseOpened, setDatabase],
  )

  return { createDatabase, openDatabase, databaseOpened, databaseName }
}
