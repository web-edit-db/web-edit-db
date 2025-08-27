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
import { IconCheck, IconRotate, IconTrash } from '@tabler/icons-react'
import { useCallback, useMemo, useState } from 'react'
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

type ModifiedState = 'original' | 'modified' | 'deleted' | 'new'
type ColumnData = {
  new: boolean
  name: string
  type: string
}
const columnTypes = ['TEXT', 'INTEGER', 'NUMERIC', 'REAL', 'BLOB']

export default function ColumnCard({ columnData }: { columnData: ColumnData }) {
  const zodSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.string().refine((value) => columnTypes.includes(value), {
      message: 'Type is required and must be one of INTEGER, TEXT, or REAL',
    }),
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
    } else if (form.formState.isDirty) {
      return 'modified'
    } else if (columnData.new) {
      return 'new'
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
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={reset} disabled={isResetDisabled}>
                    <IconRotate />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={toggleDeleted}>
                    {isDeleted ? <IconCheck /> : <IconTrash />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isDeleted ? 'Restore' : 'Delete'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-12 gap-4 px-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-6">
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
        </CardContent>
      </Card>
    </Form>
  )
}
