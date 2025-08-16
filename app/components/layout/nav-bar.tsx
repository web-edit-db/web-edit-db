import { Link } from 'react-router'
import logo from '@/assets/logo.png'
import ThemeSwitchButton from '../theme-switch-button'
import UploadDatabaseButton from '../sqlite/upload-database-button'
import CreateDatabaseButton from '../sqlite/create-database-button'
import SaveDatabaseButton from '../sqlite/save-database-button'
import DatabaseVersionButton from '../sqlite/database-version-button'
import { useDatabase } from '@/lib/sqlite/use-database'

export default function NavBar() {
  const { databaseName } = useDatabase()
  return (
    <nav className="border-primary sticky top-0 z-10 grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center border-b-[1.8px] bg-white px-3 shadow-lg dark:bg-gray-800">
      <div className="flex items-start">
        <Link
          to="/"
          className="text-primary flex cursor-pointer items-center gap-2 p-1.5 text-2xl font-light select-none"
        >
          <img src={logo} alt="" className="h-11" />
          <span className="text-primary">Web Edit DB</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {databaseName && (
          <span className="text-muted-foreground text-sm select-none">
            Currently editing: {databaseName}
          </span>
        )}
      </div>
      {/* space for the right side */}
      <div className="flex items-center justify-end gap-2">
        <UploadDatabaseButton labelText="Upload" />
        <CreateDatabaseButton labelText="Create" />
        <SaveDatabaseButton labelText="Save" />
        <DatabaseVersionButton />
        <ThemeSwitchButton />
      </div>
    </nav>
  )
}
