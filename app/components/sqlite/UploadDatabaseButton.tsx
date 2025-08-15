import { UploadIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useDatabase } from '@/lib/sqlite/useDatabase'
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
} from '../ui/alert-dialog'

export type UploadDatabaseButtonProps = {
  labelText: string | null
}

export default function UploadDatabaseButton({ labelText = null }: UploadDatabaseButtonProps) {
  const { openDatabase, databaseOpened, isLoading } = useDatabase()
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const openDatabaseHandler = useCallback(() => {
    if (databaseOpened && !showAlertDialog) {
      // show an alert that the database is already opened
      setShowAlertDialog(true)
      return
    }
    openDatabase(true)
  }, [openDatabase, databaseOpened, showAlertDialog])
  return (
    <>
      <Button 
        variant="outline" 
        size={labelText ? 'default' : 'icon'} 
        onClick={openDatabaseHandler}
        disabled={isLoading}
      >
        <UploadIcon className="h-5 w-5" />
        {labelText && <span>{labelText}</span>}
      </Button>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to open a new database? This will
              close the current database and you will lose all your changes.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={openDatabaseHandler}>Open New Database</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
