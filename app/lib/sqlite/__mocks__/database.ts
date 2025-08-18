import type { SqlJsStatic } from 'sql.js'
import { fn } from 'storybook/test'

export const Database = class {
  static version = '3.42.0-mock'
  private sqlite3: SqlJsStatic
  private filename: string
  private data?: Uint8Array

  constructor(sqlite3: SqlJsStatic, filename: string, data?: Uint8Array) {
    console.log('constructor', sqlite3, filename, data)
    this.sqlite3 = sqlite3
    this.filename = filename
    this.data = data
    return this
  }

  close() {
    return this
  }

  exportFile() {
    return new File([], this.filename, { type: 'application/vnd.sqlite3' })
  }

  getFilename() {
    return this.filename
  }

  getTableNames = fn().mockName('getTableNames').mockReturnValue([])

  static create(sqlite3: SqlJsStatic, filename: string) {
    return new Database(sqlite3, filename)
  }

  static open(sqlite3: SqlJsStatic, filename: string, data?: Uint8Array | ArrayBuffer) {
    return new Database(sqlite3, filename, data as Uint8Array)
  }

  static getVersion() {
    return this.version
  }

  static regestry = new FinalizationRegistry<() => void>((close) => {
    close()
  })
}
