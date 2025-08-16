import { useMemo } from 'react'
import { useSqliteContext } from './sqlite-provider'
import { z } from 'zod'
import { parsedQuery } from './helpers'

export const useTables = () => {
  const { database } = useSqliteContext()

  const tables = useMemo(() => {
    if (!database) return []

    const results = parsedQuery(
      database.database,
      'SELECT name, tbl_name, type FROM sqlite_master WHERE type = "table"',
      z.object({
        name: z.string(),
        tbl_name: z.string(),
        type: z.literal('table'),
      }),
    )
    return results
  }, [database])

  return {
    tables,
  }
}
