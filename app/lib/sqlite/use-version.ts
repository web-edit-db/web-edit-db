import { useSqliteContext } from './sqlite-provider'
import { useEffect, useState } from 'react'
import { getVersion } from './queries'

export const useVersion = () => {
  const { sqlite3 } = useSqliteContext()
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (!sqlite3) return
    setVersion(getVersion(sqlite3))
  }, [sqlite3])
  return {
    sqliteVersion: version,
    appVersion: __VERSION__,
    appBuildDate: __DATE__,
  }
}
