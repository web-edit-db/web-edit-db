import { useSqliteContext } from './sqlite-provider'
import { useEffect, useState } from 'react'
import { Database } from './database'

export const useVersion = () => {
  const { sqlite3 } = useSqliteContext()
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (!sqlite3) return
    setVersion(Database.getVersion(sqlite3))
  }, [sqlite3])
  return {
    sqliteVersion: version,
    appVersion: __VERSION__,
    appBuildDate: __DATE__,
  }
}
