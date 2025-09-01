import { Link } from 'react-router'
import logo from '@/assets/logo.png'
import ThemeSwitchButton from '@/components/theme-switch-button'
import UploadDatabaseButton from '@/components/sqlite/database-actions/upload-button'
import CreateDatabaseButton from '@/components/sqlite/database-actions/create-button'
import SaveDatabaseButton from '@/components/sqlite/database-actions/save-button'
import DatabaseVersionButton from '@/components/sqlite/database-info/version-button'
import { useDatabase } from '@/lib/sqlite/use-database'
import { useVersion } from '@/lib/sqlite/use-version'

export default function NavBar() {
  const { databaseName, openDatabase, databaseOpened, isLoading, createDatabase, saveDatabase } =
    useDatabase()
  const { sqliteVersion, appVersion, appBuildDate } = useVersion()
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
        <UploadDatabaseButton
          labelText="Upload"
          openDatabase={openDatabase}
          databaseOpened={databaseOpened}
          isLoading={isLoading}
        />
        <CreateDatabaseButton
          labelText="Create"
          createDatabase={createDatabase}
          databaseOpened={databaseOpened}
          isLoading={isLoading}
        />
        <SaveDatabaseButton
          labelText="Save"
          saveDatabase={saveDatabase}
          databaseOpened={databaseOpened}
          isLoading={isLoading}
        />
        <DatabaseVersionButton
          sqliteVersion={sqliteVersion}
          appVersion={appVersion}
          appBuildDate={appBuildDate}
        />
        <ThemeSwitchButton />
      </div>
    </nav>
  )
}
