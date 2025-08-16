import type { Route } from './+types/table.$name.edit'
import { decodeTableName, normalizeTableName } from '@/lib/sqlite/table-utils'

export default function TableEdit({ params }: Route.ComponentProps) {
  // Decode the table name from the URL parameter
  const tableName = normalizeTableName(decodeTableName(params.name))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-bold">Edit Database</h1>
        <p className="text-muted-foreground mt-2">
          Editing table: <span className="font-mono font-semibold">{tableName}</span>
        </p>
        <div className="text-muted-foreground mt-1 text-xs">
          URL param: <span className="font-mono">{params.name}</span>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-destructive text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground mt-2">Failed to load table editor: {errorMessage}</p>
      </div>
    </div>
  )
}
