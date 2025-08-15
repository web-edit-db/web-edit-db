import { InfoIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useVersion } from '@/lib/sqlite/useVersion'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

export type DatabaseVersionButtonProps = {
  labelText?: string | null
}

export default function DatabaseVersionButton({ labelText = null }: DatabaseVersionButtonProps) {
  const version = useVersion()
  const [showVersionDialog, setShowVersionDialog] = useState(false)

  const handleVersionClick = () => {
    setShowVersionDialog(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size={labelText ? 'default' : 'icon'}
        onClick={handleVersionClick}
        disabled={!version}
        title="View SQLite Version"
      >
        <InfoIcon className="h-5 w-5" />
        {labelText && <span>{labelText}</span>}
      </Button>

      <AlertDialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>SQLite Version</AlertDialogTitle>
            <AlertDialogDescription>
              Current SQLite version: <strong>{version || 'Unknown'}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowVersionDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
