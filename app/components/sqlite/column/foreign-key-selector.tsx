import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'

interface ForeignKeySelectorProps {
  tables: Record<string, string[]>
  value: {
    table?: string
    column?: string
  }
  onChange: (value: { table?: string; column?: string }) => void
  disabled?: boolean
}

export default function ForeignKeySelector({
  tables,
  value,
  onChange,
  disabled,
}: ForeignKeySelectorProps) {
  const [table, setTable] = useState<string>(value.table ?? '')
  const [column, setColumn] = useState<string>(value.column ?? '')

  const onChangeTable = useCallback((table: string) => {
    setTable(table)
    setColumn('')
  }, [])

  const onChangeColumn = useCallback((column: string) => {
    setColumn(column)
  }, [])

  const onClear = useCallback(() => {
    setTable('')
    setColumn('')
  }, [])

  useEffect(() => {
    onChange({
      table: table === '' ? undefined : table,
      column: column === '' ? undefined : column,
    })
  }, [table, column, onChange])

  return (
    <div className="flex">
      <Select onValueChange={onChangeTable} value={table} disabled={disabled}>
        <SelectTrigger className="w-full rounded-r-none focus:z-20">
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(tables).length === 0 ? (
            <div className="text-muted-foreground pointer-events-none px-2 py-1.5 text-sm">
              No tables yet
            </div>
          ) : (
            Object.keys(tables).map((table) => (
              <SelectItem key={table} value={table}>
                {table}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Select onValueChange={onChangeColumn} value={column} disabled={disabled}>
        <SelectTrigger
          className="-ml-[1px] w-full rounded-l-none rounded-r-none focus:z-20"
          disabled={disabled || table === ''}
        >
          <SelectValue placeholder="Select a column" />
        </SelectTrigger>
        <SelectContent>
          {table === '' ? (
            <div className="text-muted-foreground px-2 py-1.5 text-sm">Select a table first</div>
          ) : tables[table]?.length === 0 ? (
            <div className="text-muted-foreground px-2 py-1.5 text-sm">
              No columns in this table
            </div>
          ) : (
            tables[table]?.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="-ml-[1px] rounded-l-none focus:z-20"
            onClick={onClear}
          >
            <IconX />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear</TooltipContent>
      </Tooltip>
    </div>
  )
}
