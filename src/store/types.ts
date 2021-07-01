import { FileSystemHandle } from 'browser-fs-access'
import { Database } from 'sql.js'

export interface Column {
  name: string,
  type: string | null,
  min: number | null,
  max: number | null,
  unique: boolean,
  primaryKey: boolean,
  notNull: boolean,
  default: {
    value: string,
    enabled: boolean
  },
  foreign: {
    table: string | null,
    column: string | null
  }
  new: boolean,
  drop: boolean
}

interface Table {
  columns: {
    [columnName: string]: Column
  },
  new: boolean
}

export interface State {
  name: string | undefined,
  database: Database | undefined,
  handle: FileSystemHandle | undefined,
  tables: {
    [tableName: string]: Table
  },
  modifications: {
    [tableName: string]: Table
  }
}
