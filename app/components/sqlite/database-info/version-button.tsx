import { IconInfoCircle } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export type DatabaseVersionButtonProps = {
  labelText?: string | null
  sqliteVersion: string | null
  appVersion: string | null
  appBuildDate: string | null
}

export default function DatabaseVersionButton({
  labelText = null,
  sqliteVersion,
  appVersion,
  appBuildDate,
}: DatabaseVersionButtonProps) {
  const [showVersionDialog, setShowVersionDialog] = useState(false)

  const handleVersionClick = () => {
    setShowVersionDialog(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size={labelText ? 'default' : 'icon'}
        onClick={handleVersionClick}
        disabled={!sqliteVersion}
        title="View Version Information"
      >
        <IconInfoCircle className="h-5 w-5" />
        {labelText && <span>{labelText}</span>}
      </Button>

      <AlertDialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Version Information</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-foreground font-medium">Web Edit DB</div>
                  <div>
                    Version: <strong>{appVersion || 'Unknown'}</strong>
                  </div>
                  <div>
                    Built: <strong>{formatDate(appBuildDate)}</strong>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-foreground font-medium">SQLite Engine</div>
                  <div>
                    Version: <strong>{sqliteVersion || 'Unknown'}</strong>
                  </div>
                </div>
              </div>
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
