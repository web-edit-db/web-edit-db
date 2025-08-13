import { useSqlite } from './useSqlite'
import { useCallback, useMemo, useState } from 'react'
import { fileOpen } from 'browser-fs-access'
import type { Database } from 'sql.js'

type NamedDatabase = {
  database: Database
  fileName: string
}

export const useDatabase = () => {
  const { sqlite3 } = useSqlite()
  const [database, setDatabase] = useState<NamedDatabase | null>(null)

  const databaseOpened = useMemo(() => {
    if (!sqlite3) {
      return false
    }
    return database !== null
  }, [sqlite3, database])

  const createDatabase = useCallback(
    async (filename: string = 'database.db') => {
      if (!sqlite3) {
        throw new Error('SQLite is not initialized')
      }

      if (databaseOpened) {
        throw new Error('Database already opened')
      }

      const database = new sqlite3.Database()
      setDatabase({ database, fileName: filename })
      return database
    },
    [sqlite3, databaseOpened],
  )

  const openDatabase = useCallback(async () => {
    if (!sqlite3) {
      throw new Error('SQLite is not initialized')
    }

    if (databaseOpened) {
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

    // const database = await sqlite3.open(databaseBlob.name);
    // setDatabase(database);
    // return database;
  }, [sqlite3, databaseOpened])

  return { createDatabase, openDatabase, databaseOpened }
}
