import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SaveDatabaseButtonProps = {
  labelText?: string | null
  saveDatabase: () => Promise<void>
  databaseOpened: boolean
  isLoading: boolean
}

export default function SaveDatabaseButton({
  labelText = null,
  saveDatabase,
  databaseOpened,
  isLoading,
}: SaveDatabaseButtonProps) {
  return (
    <Button
      variant="default"
      size={labelText ? 'default' : 'icon'}
      onClick={saveDatabase}
      disabled={!databaseOpened || isLoading}
      title="Save Database"
    >
      <DownloadIcon className="h-5 w-5" />
      {labelText && <span>{labelText}</span>}
    </Button>
  )
}
