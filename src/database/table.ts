import { computed } from 'vue'
import { database } from './database'
import { reference, runAsObject } from '.'
import useColumn, { Column } from './column'

export default function useTables () {
  const list = computed(() => {
    if (!database.value) return []
    // eslint-disable-next-line no-unused-expressions
    reference.value
    const query = database.value.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    )
    return runAsObject(query).map((obj) => obj.name) as string[]
  })
  const drop = (table: string) => {
    // eslint-disable-next-line no-unused-expressions
    reference.value++
    database.value && database.value.run(`DROP TABLE ${table}`)
  }
  const create = (table: string, columns: Column[]) => {
    if (!database.value) return
    // eslint-disable-next-line no-unused-expressions
    reference.value
    const { columnToString } = useColumn()
    return (`CREATE TABLE [${table}] (${columns.map(columnToString).join(', ')})`)
  }
  const update = (table: string, columns: Column[]) => {
    if (!database.value) return
    const tempTable = `${table}_red_sqluirrel`
    const { columnToString } = useColumn()
    const columnRenamed = columns.filter(column => (column._name !== undefined))
    const sql = `PRAGMA foreign_keys = 0;

    CREATE TABLE [${tempTable}] AS SELECT * FROM [${table}];

    DROP TABLE [${table}];

    CREATE TABLE [${table}] (
      ${columns.map(columnToString).join(', ')}
    );

    INSERT INTO [${table}] (
      ${columnRenamed.map(column => `[${column.name}]`).join(', ')}
    ) SELECT ${columnRenamed.map((column: Column) => `[${column._name}]`).join(', ')}
        FROM ${tempTable};

    DROP TABLE [${tempTable}];

    PRAGMA foreign_keys = 1;`
    console.log(sql)
    database.value.run(sql)
    reference.value++
  }
  return { list, drop, reference, create, update }
}
