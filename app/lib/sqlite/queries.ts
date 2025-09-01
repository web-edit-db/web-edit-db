import { sqliteBoolean } from '@/lib/zod-utils'
import type { Database } from './database'
import { deconsturctColumn, parsedQuery, parsedQuerySingle } from './helpers'
import z from 'zod'
import type { SqlJsStatic } from 'sql.js'

export const getTableSchema = (db: Database, tableName: string) => {
  // SEE: https://sqlite.org/pragma.html#pragma_table_info
  const columns = parsedQuery(
    db.getDb(),
    `SELECT 
      info.name AS name, 
      info.type AS type, 
      info.[notnull] AS [notnull],
      info.dflt_value AS [default],
      info.pk AS primaryKey,
      fk_info.[table] AS foreignTable,
      fk_info.[to] AS foreignColumn
    FROM pragma_table_info("${tableName}") AS info
      LEFT JOIN pragma_foreign_key_list("${tableName}") as fk_info ON fk_info.[from] = info.name`,
    z.looseObject({
      name: z.string(),
      type: z.string(),
      notnull: sqliteBoolean,
      default: z.string().nullable(),
      primaryKey: sqliteBoolean,
      foreignTable: z.string().nullable(),
      foreignColumn: z.string().nullable(),
    }),
  )

  // now just recive the indices
  const indices = parsedQuery(
    db.getDb(),
    `SELECT 
      index_list.name as name,
      index_list.[unique] as [unique]
    FROM pragma_index_list("${tableName}") as index_list
    JOIN pragma_index_info(index_list.name) as index_info
    WHERE index_list.[unique] = 1`,
    z.looseObject({
      name: z.string(),
      unique: sqliteBoolean,
    }),
  )

  const indexMap = indices.reduce(
    (acc, index) => {
      acc[index.name] = index
      return acc
    },
    {} as Record<string, { name: string; unique: boolean }>,
  )

  return columns.map((column) => {
    const { type, min, max } = deconsturctColumn(column.type) ?? {
      type: column.type,
      min: undefined,
      max: undefined,
    }
    return {
      ...column,
      type,
      min,
      max,
      unique: indexMap[column.name]?.unique ?? false,
    }
  })
}

export const getTableNames = (db: Database) => {
  return parsedQuery(
    db.getDb(),
    'SELECT name, tbl_name FROM sqlite_master WHERE type = "table"',
    z.object({
      name: z.string(),
      tbl_name: z.string(),
    }),
  )
}

export const getVersion = (sqlite3: SqlJsStatic) => {
  // make a temporary database then delete it
  const db = new sqlite3.Database()
  const version =
    parsedQuerySingle(
      new sqlite3.Database(),
      'SELECT sqlite_version() as version',
      z.object({
        version: z.string(),
      }),
    )?.version ?? null
  db.close()
  return version
}
