import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  IconMinus,
  IconPlus,
  IconRotate,
  IconTrash,
  IconTrashOff,
  IconX,
} from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox'

const columnTypes = ['Text', 'Integer', 'Numeric', 'Real', 'Blob'] as const
type ModifiedState = 'original' | 'modified' | 'deleted' | 'new'
type ColumnData = {
  new: boolean
  name: string
  type: (typeof columnTypes)[number]
  notNull: boolean
  unique: boolean
  primaryKey: boolean
  min?: number
  max?: number
  defaultValue: {
    mode: 'value' | 'sql' | 'none'
    value?: string
  }
  foreignKey: {
    table?: string
    column?: string
  }
}

const ToggleButton = ({
  checked,
  onChange,
  disabled,
  label,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  className?: string
}) => {
  const buttonClicked = useCallback(() => {
    onChange(!checked)
  }, [checked, onChange])
  return (
    <Button
      variant="outline"
      onClick={buttonClicked}
      disabled={disabled}
      className={cn('justify-start px-2', className)}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          asChild
          // don't allow tabbing to the checkbox because we have it in the button
          tabIndex={-1}
          className="cursor-pointer"
        >
          <div>
            <CheckboxIndicator />
          </div>
        </Checkbox>
        <span>{label}</span>
      </div>
    </Button>
  )
}

const NumberInputWithPlusMinus = ({
  value,
  onChange,
  disabled,
}: {
  value: number | undefined
  onChange: (value: number | undefined) => void
  disabled?: boolean
}) => {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '')
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // prevent the user entering anything that is not a number, -, or ., remove any non-numeric characters
    const newValue = e.target.value.replace(/[^0-9.-]/g, '')
    if (newValue === '') {
      setInputValue('')
    } else {
      setInputValue(newValue)
    }
  }
  const onMinus = useCallback(() => {
    // first try and turn this into a number
    const newValue = inputValue === '' ? Number.NaN : Number(inputValue)
    if (Number.isNaN(newValue)) {
      setInputValue('0')
    } else {
      setInputValue((newValue - 1).toString())
    }
  }, [inputValue])
  const onPlus = useCallback(() => {
    const newValue = inputValue === '' ? Number.NaN : Number(inputValue)
    if (Number.isNaN(newValue)) {
      setInputValue('0')
    } else {
      setInputValue((newValue + 1).toString())
    }
  }, [inputValue])
  const onClear = useCallback(() => {
    setInputValue('')
    onChange(undefined)
  }, [onChange])
  useEffect(() => {
    const inputValueTrimmed = inputValue.trim()
    // if this is a an empty string, just a minus
    if (inputValueTrimmed === '' || inputValueTrimmed === '-') {
      onChange(undefined)
    } else {
      const newValue = Number(inputValueTrimmed)
      if (Number.isNaN(newValue)) {
        onChange(undefined)
      } else {
        onChange(newValue)
      }
    }
  }, [inputValue, onChange])
  return (
    <div className="flex">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        className="-mr-[1px] rounded-r-none focus:z-20"
      />
      <Button
        onClick={onMinus}
        size="icon"
        variant="outline"
        disabled={disabled}
        className="-ml-[1px] rounded-l-none rounded-r-none focus:z-20"
      >
        <IconMinus></IconMinus>
      </Button>
      <Button
        onClick={onPlus}
        size="icon"
        variant="outline"
        disabled={disabled}
        className="-ml-[1px] rounded-l-none rounded-r-none focus:z-20"
      >
        <IconPlus></IconPlus>
      </Button>
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

const ForeignKeySelector = ({
  tables,
  value,
  onChange,
  disabled,
}: {
  tables: Record<string, string[]>
  value: {
    table?: string
    column?: string
  }
  onChange: (value: { table?: string; column?: string }) => void
  disabled?: boolean
}) => {
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

export default function ColumnCard({
  columnData,
  tables,
}: {
  columnData: ColumnData
  tables: Record<string, string[]> // table name -> column names
}) {
  const zodSchema = z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      type: z.enum(columnTypes, { message: 'Type is required' }),
      notNull: z.boolean(),
      unique: z.boolean(),
      primaryKey: z.boolean(),
      min: z.number({ message: 'Must be a number' }).optional(),
      max: z.number({ message: 'Must be a number' }).optional(),
      defaultValue: z.object({
        mode: z.enum(['value', 'sql', 'none']),
        value: z.string().optional(),
      }),
      foreignKey: z.object({
        table: z.string().optional(),
        column: z.string().optional(),
      }),
    })
    .superRefine((data, ctx) => {
      // super refine for the min/max fields
      if (data.min !== undefined && data.max !== undefined) {
        const minNum = Number(data.min)
        const maxNum = Number(data.max)
        if (!Number.isNaN(minNum) && !Number.isNaN(maxNum) && minNum > maxNum) {
          ctx.addIssue({
            code: 'custom',
            message: 'Min must be less or equal to max',
            path: ['min'],
          })
          ctx.addIssue({
            code: 'custom',
            message: 'Max must be greater or equal to min',
            path: ['max'],
          })
        }
      }
    })
    .superRefine((data, ctx) => {
      const trimmedTable = data.foreignKey.table?.trim() || undefined

      if (trimmedTable === undefined) {
        return
      }

      // the table must be a valid table name
      if (!Object.keys(tables).includes(trimmedTable)) {
        ctx.addIssue({
          code: 'custom',
          message: 'No such table',
          path: ['foreignKey'],
        })
        return
      }

      // if the table is set, the column must be set
      if (data.foreignKey.column === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: `Select a column from the table`,
          path: ['foreignKey'],
        })
        return
      }

      // the column must be a valid column name
      if (!tables[trimmedTable]?.includes(data.foreignKey.column)) {
        ctx.addIssue({
          code: 'custom',
          message: `No such column in the table`,
          path: ['foreignKey'],
        })
        return
      }
    })
  const [isDeleted, setIsDeleted] = useState(false)
  const form = useForm<Omit<ColumnData, 'new'>>({
    defaultValues: columnData,
    resolver: zodResolver(zodSchema),
    disabled: isDeleted,
    mode: 'all',
  })
  const modifiedState: ModifiedState = useMemo(() => {
    if (isDeleted) {
      return 'deleted'
    } else if (columnData.new) {
      return 'new'
    } else if (form.formState.isDirty) {
      return 'modified'
    }
    return 'original'
  }, [form.formState.isDirty, isDeleted, columnData.new])
  const modifiedStateColor = useMemo(() => {
    switch (modifiedState) {
      case 'original':
        return 'text-green-700'
      case 'modified':
        return 'text-blue-500'
      case 'deleted':
        return 'text-red-600'
      case 'new':
        return 'text-yellow-600'
    }
  }, [modifiedState])
  const toggleDeleted = useCallback(() => {
    setIsDeleted(!isDeleted)
  }, [isDeleted])
  const reset = useCallback(() => {
    if (isDeleted) {
      setIsDeleted(false)
    }
    form.reset()
  }, [form, isDeleted])
  const isResetDisabled = useMemo(() => {
    return modifiedState === 'original' || modifiedState === 'new'
  }, [modifiedState])
  const formType = form.watch('type')
  return (
    <Form {...form}>
      <Card className="py-4">
        <CardHeader className="px-4">
          <div className="row flex items-center justify-between">
            <span>{columnData.name}</span>
            <span className={cn('select-none', modifiedStateColor)}>{modifiedState}</span>
            <div className="flex items-center gap-2">
              {!columnData.new && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={reset} disabled={isResetDisabled}>
                      <IconRotate />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleDeleted}>
                    {isDeleted ? <IconTrashOff /> : <IconTrash />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isDeleted ? 'Restore' : 'Delete'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-12 items-start gap-4 px-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {columnTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Not Null */}
          <FormField
            control={form.control}
            name="notNull"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4 md:col-span-2">
                <FormLabel>Not Null</FormLabel>
                <FormControl>
                  <ToggleButton
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    label="Not Null"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Unique */}
          <FormField
            control={form.control}
            name="unique"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4 md:col-span-2">
                <FormLabel>Unique</FormLabel>
                <FormControl>
                  <ToggleButton
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    label="Unique"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Primary Key */}
          <FormField
            control={form.control}
            name="primaryKey"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4 md:col-span-2">
                <FormLabel>Primary Key</FormLabel>
                <FormControl>
                  <ToggleButton
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    label="Primary Key"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Min/Max */}
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4 md:col-span-3">
                <FormLabel>Min</FormLabel>
                <FormControl>
                  <NumberInputWithPlusMinus
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      setTimeout(() => {
                        form.trigger(['min', 'max'])
                      }, 0)
                    }}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Max */}
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem className="col-span-12 sm:col-span-4 md:col-span-3">
                <FormLabel>Max</FormLabel>
                <FormControl>
                  <NumberInputWithPlusMinus
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      setTimeout(() => {
                        form.trigger(['min', 'max'])
                      }, 0)
                    }}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Default Value */}
          <FormField
            control={form.control}
            name="defaultValue"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel>Default Value</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange({
                      mode: value as 'value' | 'sql' | 'none',
                      value: field.value.value,
                    })
                  }}
                  defaultValue={field.value.mode}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <div className="grid w-full grid-cols-[auto_1fr]">
                      <SelectTrigger className="-mr-[1px] w-28 rounded-r-none focus:z-20">
                        <SelectValue placeholder="Select a mode" />
                      </SelectTrigger>
                      <Input
                        className="rounded-l-none focus:z-20"
                        disabled={field.disabled || field.value.mode === 'none'}
                      />
                    </div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="value">{formType}</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Foreign Key Selector */}
          <FormField
            control={form.control}
            name="foreignKey"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel>Foreign Key</FormLabel>
                <FormControl>
                  <ForeignKeySelector
                    tables={tables}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </Form>
  )
}
