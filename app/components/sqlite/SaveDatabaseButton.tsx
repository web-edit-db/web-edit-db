import { DownloadIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useDatabase } from '@/lib/sqlite/useDatabase'

export type SaveDatabaseButtonProps = {
  labelText?: string | null
}

export default function SaveDatabaseButton({ labelText = null }: SaveDatabaseButtonProps) {
  const { saveDatabase, databaseOpened, isLoading } = useDatabase()

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
