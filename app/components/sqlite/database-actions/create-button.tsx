import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCallback, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export type CreateDatabaseButtonProps = {
  labelText: string | null
  createDatabase: (filename: string, overwrite?: boolean) => Promise<void>
  databaseOpened: boolean
  isLoading: boolean
}

export default function CreateDatabaseButton({
  labelText = null,
  createDatabase,
  databaseOpened,
  isLoading,
}: CreateDatabaseButtonProps) {
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [databaseName, setDatabaseName] = useState('database.db')

  const isValidDatabaseName = useCallback((name: string) => {
    return name.trim().length > 0 && !name.includes(' ')
  }, [])

  const handleCreateClick = useCallback(() => {
    if (databaseOpened) {
      setShowWarningDialog(true)
    } else {
      setShowNameDialog(true)
    }
  }, [databaseOpened])

  const handleWarningContinue = useCallback(() => {
    setShowWarningDialog(false)
    setShowNameDialog(true)
  }, [])

  const handleCreateDatabase = useCallback(async () => {
    if (!isValidDatabaseName(databaseName)) {
      return
    }
    try {
      await createDatabase(databaseName, true)
      setShowNameDialog(false)
      setDatabaseName('database.db')
    } catch (error) {
      console.error('Failed to create database:', error)
    }
  }, [createDatabase, databaseName, isValidDatabaseName])

  const handleNameDialogClose = useCallback((open: boolean) => {
    setShowNameDialog(open)
    if (!open) {
      setDatabaseName('database.db')
    }
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size={labelText ? 'default' : 'icon'}
        onClick={handleCreateClick}
        disabled={isLoading}
      >
        <IconPlus className="h-5 w-5" />
        {labelText && <span>{labelText}</span>}
      </Button>

      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Database Already Open</AlertDialogTitle>
            <AlertDialogDescription>
              You have a database currently open. Creating a new database will close the current one
              and you will lose any unsaved changes. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWarningContinue}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showNameDialog} onOpenChange={handleNameDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Database</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for your new database. This will create an empty SQLite database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              placeholder="database.db"
              className={`w-full ${!isValidDatabaseName(databaseName) && databaseName ? 'border-destructive dark:border-destructive' : ''}`}
            />
            {databaseName && !isValidDatabaseName(databaseName) && (
              <p className="text-destructive mt-2 text-sm">
                Database name cannot contain spaces and must not be empty
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCreateDatabase}
              disabled={!isValidDatabaseName(databaseName)}
            >
              Create Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
