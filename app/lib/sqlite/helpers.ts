import type { BindParams, Database } from 'sql.js'
import { z } from 'zod'

const COLUMN_REGEX = /^(?<type>[A-Za-z]+)(\(((?<min>\d+), )?(?<max>\d*?)\)$)?/

export const parsedQuery = <T extends z.ZodObject>(
  database: Database,
  query: string,
  rowSchema: T,
  params?: BindParams,
  limit?: number,
): z.infer<T>[] => {
  try {
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
      console.error(parsedResults.error, results)
      return []
    }
    return parsedResults.data
  } catch (error) {
    console.error(error, query)
    return []
  }
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

export const deconsturctColumn = (column: string) => {
  const match = column.match(COLUMN_REGEX)
  if (!match) return undefined
  const { type, min, max } = match.groups || {}
  return {
    type: type.toLowerCase(),
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
  }
}

export const constructColumn = (column: {
  type: string
  min: number | undefined
  max: number | undefined
}) => {
  const type = column.type.toUpperCase()
  const suffix = `(${[column.min, column.max].filter((value) => value !== undefined).join(', ')})`
  if (suffix === '()') {
    return type
  }
  return `${type}${suffix}`
}
