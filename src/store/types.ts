import { FileSystemHandle } from 'browser-fs-access'
import { Database, SqlJsStatic } from 'sql.js'

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

export interface Table {
  columns: {
    [columnName: string]: Column
  },
  new: boolean
}

export interface TableModification extends Table {
  data: {
    updates: {
      [row: number]: {
        [column: string]: string|number|boolean|null|undefined
      }
    },
    new: {
      [column: string]: string|number|boolean|null|undefined
    }[]
  },
}

export interface State {
  sqlJs: SqlJsStatic|null,
  database: {
    name: string,
    connection: Database,
    handle?: FileSystemHandle
  }|null,
  tables: {
    [tableName: string]: Table
  },
  modifications: {
    [tableName: string]: TableModification
  }
}
