import { Outlet } from 'react-router'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { useDatabase } from '@/lib/sqlite/useDatabase'
import { useVersion } from '@/lib/sqlite/useVersion'

export default function Lander() {
  const { createDatabase, openDatabase, databaseOpened } = useDatabase()
  const version = useVersion()

  return databaseOpened ? (
    <Outlet />
  ) : (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <img src={logo} alt="" className="h-24 p-1.5" />
      {/* show a welcome message, ask the user to open a database or create a new one, show a button for each */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-2xl">Welcome to Web Edit DB!</p>
        <p className="text-xl">Get started by opening a database or creating a new one.</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => openDatabase()}>Upload Database</Button>
          <Button onClick={() => createDatabase()}>Create Database</Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">Sqlite version: {version}</p>
      </div>
    </div>
  )
}
