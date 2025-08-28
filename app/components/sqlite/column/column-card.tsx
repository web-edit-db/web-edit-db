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
import { IconMinus, IconPlus, IconRotate, IconTrash, IconTrashOff } from '@tabler/icons-react'
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
import { Checkbox } from '@/components/ui/checkbox'

type ModifiedState = 'original' | 'modified' | 'deleted' | 'new'
type ColumnData = {
  new: boolean
  name: string
  type: string
  notNull: boolean
  unique: boolean
  primaryKey: boolean
  min?: number
  max?: number
}
const columnTypes = ['TEXT', 'INTEGER', 'NUMERIC', 'REAL', 'BLOB']

const ToggleButton = ({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
}) => {
  const buttonClicked = useCallback(() => {
    onChange(!checked)
  }, [checked, onChange])
  return (
    <Button
      variant="outline"
      onClick={buttonClicked}
      disabled={disabled}
      className="justify-start px-2"
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          // don't allow tabbing to the checkbox because we have it in the button
          tabIndex={-1}
          className="cursor-pointer"
        />
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
        className="-ml-[1px] rounded-l-none focus:z-20"
      >
        <IconPlus></IconPlus>
      </Button>
    </div>
  )
}

export default function ColumnCard({ columnData }: { columnData: ColumnData }) {
  const zodSchema = z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      type: z.string().refine((value) => columnTypes.includes(value), {
        message: 'Type is required and must be one of INTEGER, TEXT, or REAL',
      }),
      notNull: z.boolean(),
      unique: z.boolean(),
      primaryKey: z.boolean(),
      min: z.number({ message: 'Must be a number' }).optional(),
      max: z.number({ message: 'Must be a number' }).optional(),
    })
    .superRefine((data, ctx) => {
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
                  <TooltipTrigger>
                    <Button variant="ghost" size="icon" onClick={reset} disabled={isResetDisabled}>
                      <IconRotate />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger>
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
        </CardContent>
      </Card>
    </Form>
  )
}
