import { Button } from '@/components/ui/button'
import { createColumnSchema, type ColumnData } from '@/components/sqlite/column/types'
import ColumnCard from '@/components/sqlite/column/column-card'
import { useFieldArray, useForm } from 'react-hook-form'
import { useCallback, useMemo, useState, useRef } from 'react'
import { scrollIntoViewSmooth } from '@/lib/scroll-into-view'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import {
  SortableGroupContext,
  SortableGroupItem,
  SortableGroupItemContext,
  SortableGroupItemOverlay,
} from '@/components/core/sortable-group'
import { AnimatePresence } from 'motion/react'

interface ComponentListProps {
  name: string
  columns: Omit<ColumnData, 'deleted' | 'new'>[]
  tables: Record<string, string[]>
}

type FormState = {
  name: string
  columns: ColumnData[]
}

const ColumnButton = ({ columnData, onClick }: { columnData: ColumnData; onClick: () => void }) => {
  return (
    <Button
      key={columnData.name}
      variant="outline"
      className={cn(
        'w-full justify-start',
        columnData.new && 'italic',
        columnData.deleted && 'line-through',
      )}
      onClick={onClick}
    >
      {columnData.name}
    </Button>
  )
}

export default function ComponentList({ columns, tables, name }: ComponentListProps) {
  const columnRefs = useRef<(HTMLDivElement | null)[]>([])
  const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null)

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

  const [columnOrder, setColumnOrder] = useState(
    columns.map((_, index) => ({ id: index.toString() })),
  )

  const removeColumn = useCallback(
    (index: number) => {
      remove(index)
      setColumnOrder(columnOrder.filter((column) => column.id !== index.toString()))
    },
    [remove, columnOrder],
  )

  const addColumn = useCallback(() => {
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
    setColumnOrder([...columnOrder, { id: columnsWatch.length.toString() }])
  }, [append, columnsWatch, columnOrder])

  const scrollToColumn = useCallback((index: number) => {
    const columnRef = columnRefs.current[index]
    if (columnRef) {
      // Set highlighted column for visual feedback
      setHighlightedColumn(index)

      // Scroll to the column
      scrollIntoViewSmooth(columnRef, 100)

      // Clear highlight after animation completes
      setTimeout(() => {
        setHighlightedColumn(null)
      }, 1200) // Slightly longer than scroll duration to ensure effect is visible
    }
  }, [])

  const overlayColumnCard = useCallback(
    (activeItem: { id: string | number }) => {
      const idAsInt = Number(activeItem.id)
      const column = form.getValues('columns')[idAsInt]
      if (!column) return null
      return (
        <SortableGroupItemOverlay className={'rounded-md'}>
          <ColumnCard
            columnData={column}
            tables={{}}
            onDeleteNewColumn={() => {}}
            highlighted={false}
            disabled={false}
          />
        </SortableGroupItemOverlay>
      )
    },
    [form],
  )

  const overlayColumnButton = useCallback(
    (activeItem: { id: string | number }) => {
      const idAsInt = Number(activeItem.id)
      const column = form.getValues('columns')[idAsInt]
      if (!column) return null
      return (
        <SortableGroupItemOverlay className={'rounded-md'}>
          <ColumnButton columnData={column} onClick={() => {}} />
        </SortableGroupItemOverlay>
      )
    },
    [form],
  )

  return (
    <SortableGroupContext items={columnOrder} setItems={setColumnOrder}>
      <div className="mx-auto grid max-w-7xl grid-cols-6 items-start gap-4">
        <div className="col-span-5 flex flex-col gap-4">
          <SortableGroupItemContext overlay={overlayColumnCard}>
            <AnimatePresence>
              {columnOrder.map((column) => {
                const index = Number(column.id)
                const columnData = fields[index]
                if (!columnData) return null
                return (
                  <SortableGroupItem
                    key={column.id}
                    id={column.id}
                    className={'rounded-md'}
                    setRef={(el) => {
                      columnRefs.current[index] = el
                    }}
                  >
                    <ColumnCard
                      columnData={columnData}
                      tables={tables}
                      onDeleteNewColumn={() => {
                        removeColumn(index)
                      }}
                      highlighted={highlightedColumn === index}
                      disabled={false}
                    />
                  </SortableGroupItem>
                )
              })}
            </AnimatePresence>
          </SortableGroupItemContext>
        </div>
        <div className="sticky top-4 col-span-1 flex flex-col gap-2">
          <SortableGroupItemContext overlay={overlayColumnButton}>
            <AnimatePresence>
              {columnOrder.map((column) => {
                const index = Number(column.id)
                const columnData = fields[index]
                if (!columnData) return null
                return (
                  <SortableGroupItem key={column.id} id={column.id} className={'rounded-md'}>
                    <ColumnButton
                      key={columnData.name}
                      columnData={columnData}
                      onClick={() => scrollToColumn(index)}
                    />
                  </SortableGroupItem>
                )
              })}
            </AnimatePresence>
          </SortableGroupItemContext>
          <Button
            variant="default"
            className="w-full justify-start"
            onClick={addColumn}
            type="button"
          >
            <span>New Column</span>
          </Button>
        </div>
      </div>
    </SortableGroupContext>
  )
}
