import { parsedQuerySingle } from './helpers'
import { z } from 'zod'
import { useSqliteContext } from './SqliteProvider'
import { useEffect, useState } from 'react'

export const useVersion = () => {
  const { sqlite3 } = useSqliteContext()
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (!sqlite3) return
    const { version } = parsedQuerySingle(
      new sqlite3.Database(),
      'SELECT sqlite_version() as version',
      z.object({
        version: z.string(),
      }),
    ) ?? { version: null }
    setVersion(version)
  }, [sqlite3])
  return {
    sqliteVersion: version,
    appVersion: __VERSION__,
    appBuildDate: __DATE__,
  }
}
