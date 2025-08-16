import { useEffect, useState } from 'react'
import type { SqlJsStatic } from 'sql.js'
import { z } from 'zod'
import { createExecSchema, singleResult } from './utils'
import { useSqliteContext } from './SqliteProvider'

const versionSchema = singleResult(createExecSchema(['sqlite_version()'], [z.string()])).transform(
  (data) => data.value?.[0] ?? null,
)

const getVersion = (sqlite3: SqlJsStatic) => {
  const databaseConnection = new sqlite3.Database()
  const query = databaseConnection.exec('SELECT sqlite_version()')
  const versionParsed = versionSchema.safeParse(query)
  if (!versionParsed.success) {
    console.error(versionParsed.error)
  }
  return versionParsed.data ?? null
}

export const useSqlite = () => {
  const { sqlite3 } = useSqliteContext()
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (!sqlite3) return
    const version = getVersion(sqlite3)
    setVersion(version)
  }, [sqlite3])

  return {
    sqlite3,
    sqliteVersion: version,
    appVersion: __VERSION__,
    appBuildDate: __DATE__,
  }
}
