import TableEditor from '@/components/sqlite/table/table-editor'
import type { Route } from './+types/table.$name.edit'
import { decodeTableName, normalizeTableName } from '@/lib/sqlite/table-utils'
import { useTable, useTableTree } from '@/lib/sqlite/use-table'
import type { ColumnData } from '@/components/sqlite/column/types'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export default function TableEdit({ params }: Route.ComponentProps) {
  // Decode the table name from the URL parameter
  const tableName = normalizeTableName(decodeTableName(params.name))

  const schema = useTable(tableName)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const tableTree = useTableTree()

  useEffect(() => {
    console.log('tableTree', tableTree)
  }, [tableTree])

  const columns = useMemo(
    () =>
      schema.map(
        (column) =>
          ({
            ...column,
            defaultValue: column.default
              ? { mode: 'sql', value: column.default }
              : { mode: 'none', value: undefined },
            foreignKey: { table: column.foreignTable, column: column.foreignColumn },
          }) as Omit<ColumnData, 'deleted' | 'new'>,
      ),
    [schema],
  )

  const setScrollContainer = useCallback((el: HTMLDivElement | null) => {
    console.log('setScrollContainer', el)
    scrollContainerRef.current = el
  }, [])

  return (
    <div
      className="max-h-[calc(100svh-var(--header-height))]! overflow-y-auto"
      ref={setScrollContainer}
    >
      <TableEditor
        className="p-2"
        key={tableName}
        columns={columns}
        tables={tableTree}
        name={tableName}
        scrollContainer={scrollContainerRef.current}
      />
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
