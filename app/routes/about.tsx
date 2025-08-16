import { useVersion } from '@/lib/sqlite/use-version'

export default function About() {
  const { appVersion, sqliteVersion, appBuildDate } = useVersion()
  return (
    <>
      <title>Web Edit DB - About</title>
      <div>
        <p>Web Edit DB</p>
        <p>Version: {appVersion}</p>
        <p>Built: {appBuildDate}</p>
        <p>SQLite Version: {sqliteVersion}</p>
      </div>
    </>
  )
}
