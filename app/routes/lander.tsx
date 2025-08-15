import { Outlet } from 'react-router'
import logo from '@/assets/logo.png'
import UploadDatabaseButton from '@/components/sqlite/UploadDatabaseButton'
import CreateDatabaseButton from '@/components/sqlite/CreateDatabaseButton'
import { useDatabase } from '@/lib/sqlite/useDatabase'
import { useVersion } from '@/lib/sqlite/useVersion'

export default function Lander() {
  const { databaseOpened } = useDatabase()
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
        <div className="mt-4 flex gap-4">
          <UploadDatabaseButton labelText="Upload Database" />
          <CreateDatabaseButton labelText="Create Database" />
        </div>
        <p className="text-muted-foreground mt-4 text-sm">Sqlite version: {version}</p>
      </div>
    </div>
  )
}
