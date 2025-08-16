import { useCallback, useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'
import type { QueryExecResult } from 'sql.js'

export const useSqlite = () => {
  const { sqlite3, database, isLoading, error } = useSqliteContext()

  const isReady = useMemo(() => {
    return !isLoading && !error && sqlite3 !== null && database !== null
  }, [isLoading, error, sqlite3, database])

  const execute = useCallback(
    async (sql: string): Promise<QueryExecResult[]> => {
      if (!database?.database) {
        throw new Error('No database connection available')
      }

      try {
        const results = database.database.exec(sql)
        return results
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown database error'
        throw new Error(`SQL execution failed: ${message}`)
      }
    },
    [database],
  )

  const queryValue = useCallback(
    async (sql: string): Promise<unknown> => {
      const results = await execute(sql)
      if (results.length === 0 || results[0].values.length === 0) {
        return null
      }
      return results[0].values[0][0]
    },
    [execute],
  )

  const queryArray = useCallback(
    async (sql: string): Promise<unknown[][]> => {
      const results = await execute(sql)
      if (results.length === 0) {
        return []
      }
      return results[0].values
    },
    [execute],
  )

  const queryObject = useCallback(
    async (sql: string): Promise<Record<string, unknown>[]> => {
      const results = await execute(sql)
      if (results.length === 0) {
        return []
      }

      const { columns, values } = results[0]
      return values.map((row) => {
        const obj: Record<string, unknown> = {}
        columns.forEach((column, index) => {
          obj[column] = row[index]
        })
        return obj
      })
    },
    [execute],
  )

  const executeBatch = useCallback(
    async (statements: string[]): Promise<void> => {
      if (!database?.database) {
        throw new Error('No database connection available')
      }

      try {
        database.database.exec('BEGIN TRANSACTION')

        for (const statement of statements) {
          database.database.exec(statement)
        }

        database.database.exec('COMMIT')
      } catch (error) {
        try {
          database.database.exec('ROLLBACK')
        } catch (rollbackError) {
          console.error('Failed to rollback transaction:', rollbackError)
        }

        const message = error instanceof Error ? error.message : 'Unknown database error'
        throw new Error(`Batch execution failed: ${message}`)
      }
    },
    [database],
  )

  const executeWithCallback = useCallback(
    async (
      sql: string,
      callback: (row: Record<string, unknown>) => void | false,
    ): Promise<void> => {
      if (!database?.database) {
        throw new Error('No database connection available')
      }

      try {
        const statement = database.database.prepare(sql)

        while (statement.step()) {
          const row = statement.getAsObject()
          const result = callback(row)
          if (result === false) {
            break
          }
        }

        statement.free()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown database error'
        throw new Error(`Callback execution failed: ${message}`)
      }
    },
    [database],
  )

  return {
    sqlite3,
    database: database?.database || null,
    isLoading,
    error,
    isReady,
    execute,
    queryValue,
    queryArray,
    queryObject,
    executeBatch,
    executeWithCallback,
  }
}
