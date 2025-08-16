import { Outlet, useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useFirstMountState, useSessionStorage, useUpdateEffect } from 'react-use'
import logo from '@/assets/logo.png'
import UploadDatabaseButton from '@/components/sqlite/database-actions/upload-button'
import CreateDatabaseButton from '@/components/sqlite/database-actions/create-button'
import { useDatabase } from '@/lib/sqlite/use-database'
import { useVersion } from '@/lib/sqlite/use-version'

export default function Lander() {
  const { databaseOpened } = useDatabase()
  const { sqliteVersion } = useVersion()
  const location = useLocation()
  const navigate = useNavigate()

  // Use react-use's useSessionStorage for cleaner state management
  const [intendedRoute, setIntendedRoute] = useSessionStorage<string | null>(
    'web-edit-db-intended-route',
    null,
  )

  const isFirstMount = useFirstMountState()

  // Store intended route when landing on a non-root path without a database
  useEffect(() => {
    if (!databaseOpened && location.pathname !== '/') {
      // Store the intended destination (update if different)
      if (intendedRoute !== location.pathname) {
        setIntendedRoute(location.pathname)
      }

      // Redirect to root
      navigate('/', { replace: true })
    } else if (location.pathname === '/' && intendedRoute && isFirstMount) {
      // Clear intended route when user explicitly navigates to root
      // (but not on first mount to avoid clearing before database opens)
      setIntendedRoute(null)
    }
  }, [databaseOpened, location.pathname, navigate, intendedRoute, setIntendedRoute, isFirstMount])

  // Navigate to stored route when database opens (using useUpdateEffect to skip initial render)
  useUpdateEffect(() => {
    if (databaseOpened && intendedRoute && intendedRoute !== '/') {
      // Clear the stored route and navigate
      setIntendedRoute(null)

      try {
        navigate(intendedRoute, { replace: true })
      } catch (error) {
        console.error('Failed to navigate to intended route:', error)
      }
    }
  }, [databaseOpened])

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
        <p className="text-muted-foreground mt-4 text-sm">Sqlite version: {sqliteVersion}</p>
      </div>
    </div>
  )
}
