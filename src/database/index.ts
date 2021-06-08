import useTables from './table'
import useDatabase, { database } from './database'
import useColumn, { Column } from './column'
import { ref } from 'vue'
import { Database, ParamsObject, Statement } from 'sql.js'
export { useDatabase, useTables, useColumn }
export type { Column }

export const reference = ref(0) // this is used as a common references between all methods so that results are recomputed
export function runAsObject <T extends ParamsObject> (statement: Statement | string): Array<T> {
  if (typeof statement === 'string') {
    statement = (database.value as Database).prepare(statement)
  }
  // eslint-disable-next-line no-unused-expressions
  // database.value
  const results = []
  while (statement.step()) results.push(statement.getAsObject())
  return results as T[]
}
