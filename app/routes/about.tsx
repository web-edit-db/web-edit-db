import { useSqlite } from "@/lib/useSqlite";

export default function About() {
  const { version } = useSqlite();
  return (
    <>
      <title>Web Edit DB - About</title>
      <div>About {version}</div>
    </>
  )
}
