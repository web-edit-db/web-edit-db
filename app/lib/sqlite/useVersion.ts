import { useSqlite } from './useSqlite'

export const useVersion = () => {
  const { sqliteVersion, appVersion, appBuildDate } = useSqlite()
  return {
    sqliteVersion,
    appVersion,
    appBuildDate,
  }
}
