import { track, TrackOpTypes } from '@vue/reactivity'
import { database } from './database'
import { reference, runAsObject } from '.'
import { SqlValue } from 'sql.js'

export interface Column {
  name: string,
  origName?: string,
  type: string | null,
  min?: number | null,
  max?: number | null,
  notNull: boolean,
  primaryKey: boolean,
  unique: boolean,
  defaultValue?: string,
  foreign?: {
    table: string,
    column: string
  }
}

export default function useColumn () {
  const list = (name: string): Column[] => {
    if (!database.value) return []
    track(reference, 'get' as TrackOpTypes.GET, 'value')
    const uniqueColumns = runAsObject<{name: string}>(
      `SELECT index_info.name
        FROM pragma_index_list('${name}') AS index_list
          JOIN pragma_index_info(index_list.name) AS index_info
        WHERE index_list.[unique];`
    ).map(({ name }) => name)
    const foreignKeys = runAsObject<{table: string, from: string, to: string}>(
      `SELECT [table],
              [from],
              [to]
        FROM pragma_foreign_key_list('${name}');`
    )
    const columns = runAsObject<{name: string, notnull: number, 'dflt_value': SqlValue, pk: number, type: string }>(
      `PRAGMA table_info(${name})`
    ).map(({ name, notnull, dflt_value: defaultValue, pk, type: typeString }) => {
      const { type, max, min } =
        typeString.match(/^(?<type>[a-zA-Z]+)(\(((?<min>\d+), )?(?<max>\d*?)\)$)?/)?.groups ?? {
          type: null, max: null, min: null
        }
      const foreign = foreignKeys.find(({ from }) => from === name)
      return {
        name,
        type,
        min: min ? parseInt(min) : null,
        max: max ? parseInt(max) : null,
        notNull: !!notnull,
        primaryKey: !!pk,
        defaultValue: defaultValue?.toString(),
        unique: uniqueColumns.includes(name),
        foreign: foreign && {
          table: foreign.table,
          column: foreign.to
        }
      }
    })
    return columns
  }
  const columnToString = ({ name, type, min, max, primaryKey, unique, notNull, defaultValue }: Column) => {
    // add min and max to type correctly
    if (min || max) type = type + (min && max ? `(${min}, ${max})` : `(${max || min})`)
    const parts = [`[${name}] ${type}`]
    if (primaryKey) parts.push('PRIMARY KEY')
    if (unique) parts.push('UNIQUE')
    if (notNull) parts.push('NOT NULL')
    if (defaultValue) parts.push(`DEFAULT ${defaultValue}`)
    return parts.join(' ')
  }
  return { list, columnToString }
}
