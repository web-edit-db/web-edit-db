import { computed, TrackOpTypes, triggerRef } from 'vue'
import { track } from '@vue/reactivity'
import { database } from './database'
import { reference, runAsObject } from '.'
import useColumn, { Column } from './column'

export default function useTables () {
  const list = computed(() => {
    if (!database.value) return []
    track(reference, 'get' as TrackOpTypes.GET, 'value')
    const query = database.value.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY 1"
    )
    return runAsObject(query).map((obj) => obj.name) as string[]
  })
  const drop = (table: string) => {
    triggerRef(reference)
    database.value && database.value.run(`DROP TABLE ${table}`)
  }
  const create = (table: string, columns: Column[]) => {
    if (!database.value) return
    track(reference, 'get' as TrackOpTypes.GET, 'value')
    const { columnToString } = useColumn()
    return (`CREATE TABLE [${table}] (${columns.map(columnToString).join(', ')})`)
  }
  const update = (table: string, columns: Column[], newName?: string) => {
    if (!database.value) return
    const tempTable = `${table}_red_sqluirrel`
    const { columnToString } = useColumn()
    const columnsModified = columns.filter(column => (column.origName !== undefined))
    const sql = []
    sql.push(`CREATE TABLE [${tempTable}] AS SELECT * FROM [${table}];`)
    sql.push(`DROP TABLE [${table}];`)
    sql.push(
    `CREATE TABLE [${newName ?? table}] (
      ${columns.map(columnToString).join(', ')}
    );`)
    // if there are modified columns transfer the data from the temp table to the new one
    if (columnsModified.length) {
      sql.push(
      `INSERT INTO [${newName ?? table}] (
        ${columnsModified.map(column => `[${column.name}]`).join(', ')}
      ) SELECT ${columnsModified.map((column: Column) => `[${column.origName}]`).join(', ')}
          FROM ${tempTable};`)
    }
    sql.push(`DROP TABLE [${tempTable}];`)
    database.value.run(sql.join('\n\n'))
    triggerRef(reference)
  }
  const rename = (table: string, newName: string) => {
    const { list: columnList } = useColumn()
    const columns = columnList(table)
    update(table, columns, newName)
  }
  return { list, drop, reference, create, update, rename }
}
