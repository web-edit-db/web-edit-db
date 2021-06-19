import { ParamsObject, Statement } from 'sql.js'
import store from './index'
import { Column } from './types'

export const SQLITE_EXTENSIONS = ['.db', '.sqlite', '.sqlite3']

export function runStatement <T extends ParamsObject> (statement: Statement | string): Array<T> {
  if (!store.state.database) return []
  if (typeof statement === 'string') statement = store.state.database.prepare(statement)

  const results = []
  while (statement.step()) results.push(statement.getAsObject())
  return results as T[]
}

export function columnToString ({ name, type, min, max, unique, primaryKey, notNull, default: default_ }: Column): string {
  if (min || max) type = type + (min && max ? `(${min}, ${max})` : `(${max || min})`)
  const parts = [`[${name}] ${type}`]
  if (primaryKey) parts.push('PRIMARY KEY')
  if (unique) parts.push('UNIQUE')
  if (notNull) parts.push('NOT NULL')
  if (default_.enabled && default_.value.length > 0) parts.push(`DEFAULT ${default_.value}`)
  return parts.join(' ')
}
