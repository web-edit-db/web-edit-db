import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { Control, FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form'

interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  className?: string
  render: ({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode
}

export default function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, className, render }: FormFieldWrapperProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
