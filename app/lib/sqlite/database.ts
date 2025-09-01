import type { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import z from 'zod'
import { parsedQuerySingle } from './helpers'

export class Database {
  private db: SqlJsDatabase
  private filename: string

  constructor(sqlite3: SqlJsStatic, filename: string, data?: Uint8Array) {
    this.db = new sqlite3.Database(data)
    this.filename = filename
    Database.regestry.register(this, this.close)
  }

  getDb() {
    return this.db
  }

  close() {
    this.db.close()
  }

  exportFile() {
    const buffer = this.db.export()
    const file = new File([buffer], this.filename, { type: 'application/vnd.sqlite3' })
    return file
  }

  getFilename() {
    return this.filename
  }

  static open(sqlite3: SqlJsStatic, filename: string, data?: Uint8Array | ArrayBuffer) {
    if (data instanceof Uint8Array) {
      return new Database(sqlite3, filename, data)
    }
    if (data instanceof ArrayBuffer) {
      return new Database(sqlite3, filename, new Uint8Array(data))
    }
    return new Database(sqlite3, filename, undefined)
  }

  static create(sqlite3: SqlJsStatic, filename: string) {
    return new Database(sqlite3, filename)
  }

  static getVersion(sqlite3: SqlJsStatic): string | null {
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

  static regestry = new FinalizationRegistry<() => void>((close) => {
    close()
  })
}
