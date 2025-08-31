import { Button } from '@/components/ui/button'
import type { ColumnData } from './types'
import ColumnCard from './column-card'

interface ComponentListProps {
  columns: Omit<ColumnData, 'deleted'>[]
  tables: Record<string, string[]>
}

export default function ComponentList({ columns, tables }: ComponentListProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-6 items-start gap-4">
      <div className="col-span-5 flex flex-col gap-4">
        {columns.map((column) => (
          <ColumnCard key={column.name} columnData={column} tables={tables} />
        ))}
      </div>
      <div className="sticky top-4 col-span-1 flex flex-col gap-2">
        {columns.map((column) => (
          <Button key={column.name} variant="outline" className="w-full justify-start">
            {column.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
