import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Import extracted components and types
import { createColumnSchema } from './types'
import type { ColumnData, ModifiedState } from './types'
import ColumnCardHeader from './column-card-header'
import DefaultValueSelector from './default-value-selector'
import ForeignKeySelector from './foreign-key-selector'
import FormFieldWrapper from './form-field-wrapper'
import NumberInputWithPlusMinus from './number-input-with-plus-minus'
import ToggleButton from './toggle-button'
import TypeSelector from './type-selector'
import { cn } from '@/lib/utils'

interface ColumnCardProps {
  columnData: Omit<ColumnData, 'deleted'>
  onDeleteNewColumn: () => void
  tables: Record<string, string[]> // table name -> column names
  highlighted: boolean
  disabled: boolean
}

export default function ColumnCard({
  columnData,
  tables,
  onDeleteNewColumn,
  highlighted,
  disabled: disabledProp,
}: ColumnCardProps) {
  const zodSchema = createColumnSchema(tables)
  const [disabled, setDisabled] = useState(false)

  const form = useForm<ColumnData>({
    defaultValues: columnData,
    resolver: zodResolver(zodSchema),
    disabled: disabledProp || disabled,
    mode: 'all',
  })

  const isDeleted = form.watch('deleted')

  useEffect(() => {
    console.log('isDeleted', isDeleted)
    setDisabled(isDeleted === true)
  }, [isDeleted])

  useEffect(() => {
    console.log('Form state:', {
      isDirty: form.formState.isDirty,
      dirtyFields: form.formState.dirtyFields,
      defaultValues: form.formState.defaultValues,
      values: form.getValues(),
    })
  }, [form.formState.isDirty])

  const isDirty = useMemo(() => {
    // console.log('isDirty', form.formState.isDirty, form.formState.dirtyFields)
    return form.formState.isDirty
    // return Object.keys(form.formState.dirtyFields).length > 0
  }, [form.formState.isDirty])

  const modifiedState: ModifiedState = useMemo(() => {
    if (isDeleted) return 'deleted'
    if (columnData.new) return 'new'
    if (isDirty) return 'modified'
    return 'original'
  }, [isDirty, isDeleted, columnData.new])

  const toggleDeleted = useCallback(() => {
    form.setValue('deleted', !form.getValues('deleted'))
    if (form.getValues('new')) {
      onDeleteNewColumn()
    }
  }, [form, onDeleteNewColumn])

  const reset = useCallback(() => {
    // form.reset(columnData)
    setTimeout(() => form.reset(columnData), 0)
  }, [form, columnData])

  const isResetDisabled = useMemo(() => {
    return modifiedState === 'original' || modifiedState === 'new'
  }, [modifiedState])

  const formType = form.watch('type')

  const handleTriggerValidation = useCallback(() => {
    form.trigger(['min', 'max'])
  }, [form])
  return (
    <Form {...form}>
      <Card
        className={cn(
          'py-4',
          highlighted &&
            'bg-blue-50/20 shadow-2xl ring-4 shadow-blue-400/30 ring-blue-400/50 transition-all duration-300 ease-out dark:bg-blue-950/20',
        )}
      >
        <ColumnCardHeader
          columnName={columnData.name}
          modifiedState={modifiedState}
          isDeleted={isDeleted}
          isNew={columnData.new}
          isResetDisabled={isResetDisabled}
          onReset={reset}
          onToggleDeleted={toggleDeleted}
        />
        <CardContent className="grid grid-cols-12 items-start gap-4 px-4">
          {/* Name */}
          <FormFieldWrapper
            control={form.control}
            name="name"
            label="Name"
            className="col-span-12 md:col-span-6"
            render={({ field }) => <Input {...field} />}
          />

          {/* Type */}
          <FormFieldWrapper
            control={form.control}
            name="type"
            label="Type"
            className="col-span-12 md:col-span-6"
            render={({ field }) => (
              <TypeSelector
                value={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
              />
            )}
          />

          {/* Not Null */}
          <FormFieldWrapper
            control={form.control}
            name="notNull"
            label="Not Null"
            className="col-span-12 sm:col-span-4 md:col-span-2"
            render={({ field }) => (
              <ToggleButton
                checked={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
                label="Not Null"
              />
            )}
          />

          {/* Unique */}
          <FormFieldWrapper
            control={form.control}
            name="unique"
            label="Unique"
            className="col-span-12 sm:col-span-4 md:col-span-2"
            render={({ field }) => (
              <ToggleButton
                checked={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
                label="Unique"
              />
            )}
          />

          {/* Primary Key */}
          <FormFieldWrapper
            control={form.control}
            name="primaryKey"
            label="Primary Key"
            className="col-span-12 sm:col-span-4 md:col-span-2"
            render={({ field }) => (
              <ToggleButton
                checked={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
                label="Primary Key"
              />
            )}
          />

          {/* Min */}
          <FormFieldWrapper
            control={form.control}
            name="min"
            label="Min"
            className="col-span-12 sm:col-span-4 md:col-span-3"
            render={({ field }) => (
              <NumberInputWithPlusMinus
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  setTimeout(handleTriggerValidation, 0)
                }}
                disabled={field.disabled}
              />
            )}
          />

          {/* Max */}
          <FormFieldWrapper
            control={form.control}
            name="max"
            label="Max"
            className="col-span-12 sm:col-span-4 md:col-span-3"
            render={({ field }) => (
              <NumberInputWithPlusMinus
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                  setTimeout(handleTriggerValidation, 0)
                }}
                disabled={field.disabled}
              />
            )}
          />

          {/* Default Value */}
          <FormFieldWrapper
            control={form.control}
            name="defaultValue"
            label="Default Value"
            className="col-span-12 md:col-span-6"
            render={({ field }) => (
              <DefaultValueSelector
                value={field.value}
                disabled={field.disabled}
                onChange={field.onChange}
                formType={formType}
              />
            )}
          />

          {/* Foreign Key Selector */}
          <FormFieldWrapper
            control={form.control}
            name="foreignKey"
            label="Foreign Key"
            className="col-span-12 md:col-span-6"
            render={({ field }) => (
              <ForeignKeySelector
                tables={tables}
                value={field.value}
                onChange={field.onChange}
                disabled={field.disabled}
              />
            )}
          />
        </CardContent>
      </Card>
    </Form>
  )
}
