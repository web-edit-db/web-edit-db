import { Button } from '@/components/ui/button'
import { createColumnSchema, type ColumnData } from './types'
import ColumnCard from './column-card'
import { useFieldArray, useForm } from 'react-hook-form'
import { useCallback, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

interface ComponentListProps {
  name: string
  columns: Omit<ColumnData, 'deleted' | 'new'>[]
  tables: Record<string, string[]>
}

type FormState = {
  name: string
  columns: ColumnData[]
}

export default function ComponentList({ columns, tables, name }: ComponentListProps) {
  const formDefault = useMemo(() => {
    return {
      name,
      columns: columns.map(
        (column) => ({ ...column, new: false, deleted: false }) satisfies ColumnData,
      ),
    }
  }, [columns, name])
  const formSchema = useMemo(() => {
    const columnSchema = createColumnSchema(tables)
    return z.object({
      name: z.string(),
      columns: z.array(columnSchema),
    })
  }, [tables])

  const form = useForm<FormState>({
    defaultValues: formDefault,
    resolver: zodResolver(formSchema),
  })

  const columnsWatch = form.watch('columns')

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'columns',
  })

  const addNewColumn = useCallback(() => {
    append({
      name: `Column ${columnsWatch.length + 1}`,
      type: 'Integer',
      new: true,
      deleted: false,
      notNull: false,
      unique: false,
      primaryKey: false,
      min: undefined,
      max: undefined,
      defaultValue: { mode: 'none', value: undefined },
      foreignKey: { table: null, column: null },
    })
  }, [append, columnsWatch])
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-6 items-start gap-4">
      <div className="col-span-5 flex flex-col gap-4">
        {fields.map((column, index) => (
          <ColumnCard
            key={column.name}
            columnData={column}
            tables={tables}
            onDeleteNewColumn={() => remove(index)}
          />
        ))}
      </div>
      <div className="sticky top-4 col-span-1 flex flex-col gap-2">
        {columnsWatch.map((column) => (
          <Button
            key={column.name}
            variant="outline"
            className={cn('w-full justify-start', column.new && 'italic')}
          >
            {column.name}
          </Button>
        ))}
        <Button
          variant="default"
          className="w-full justify-start"
          onClick={addNewColumn}
          type="button"
        >
          <span>New Column</span>
        </Button>
      </div>
    </div>
  )
}
