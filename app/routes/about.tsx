import { useVersion } from '@/lib/sqlite/useVersion'

export default function About() {
  const version = useVersion()
  return (
    <>
      <title>Web Edit DB - About</title>
      <div>About {version}</div>
    </>
  )
}
