import type { BindParams, Database } from 'sql.js'
import { z } from 'zod'

export const parsedQuery = <T extends z.ZodObject>(
  database: Database,
  query: string,
  rowSchema: T,
  params?: BindParams,
  limit?: number,
): z.infer<T>[] => {
  const statement = database.prepare(query)
  // bind params
  if (params) {
    statement.bind(params)
  }
  const results = [] as unknown[]
  while (statement.step() && (limit === undefined || results.length < limit)) {
    const row = statement.getAsObject()
    results.push(row)
  }
  statement.free()
  const parsedResults = z.array(rowSchema).safeParse(results)
  if (!parsedResults.success) {
    console.error(parsedResults.error)
    return []
  }
  return parsedResults.data
}

export const parsedQuerySingle = <T extends z.ZodObject>(
  database: Database,
  query: string,
  rowSchema: T,
  params?: BindParams,
): z.infer<T> | null => {
  const results = parsedQuery(database, query, rowSchema, params)
  return results.length > 0 ? results[0] : null
}
