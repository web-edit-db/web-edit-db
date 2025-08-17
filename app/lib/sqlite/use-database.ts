import { useCallback, useMemo, useState } from 'react'
import { fileOpen, fileSave } from 'browser-fs-access'
import { toast } from 'sonner'
import { useSqliteContext } from './sqlite-provider'
import { Database } from './database'

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
    return database.getFilename()
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
        setDatabase(Database.create(sqlite3, filename))
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
        setDatabase(Database.open(sqlite3, databaseBlob.name, await databaseBlob.arrayBuffer()))
      } finally {
        setIsOperationLoading(false)
      }
    },
    [sqlite3, databaseOpened, setDatabase],
  )

  const saveDatabase = useCallback(async () => {
    if (!database || !databaseOpened || !databaseName) {
      toast.error('No database to save')
      return
    }

    setIsOperationLoading(true)
    try {
      const databaseFile = database.exportFile()
      await fileSave(databaseFile, {
        extensions: ['.db', '.sqlite', '.sqlite3'],
        fileName: databaseName,
        description: 'SQLite Database',
      })

      toast.success('Database saved successfully')
    } catch (error) {
      console.error('Failed to save database:', error)
      toast.error('Failed to save database')
    } finally {
      setIsOperationLoading(false)
    }
  }, [database, databaseOpened, databaseName])

  return { createDatabase, openDatabase, saveDatabase, databaseOpened, databaseName, isLoading }
}
