import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCallback } from 'react'

interface DefaultValueSelectorProps {
  value: {
    mode: 'value' | 'sql' | 'none' | 'null'
    value?: string
  }
  onChange: (value: { mode: 'value' | 'sql' | 'none' | 'null'; value?: string }) => void
  formType: string
  disabled?: boolean
}

export default function DefaultValueSelector({
  value,
  disabled,
  onChange,
  formType,
}: DefaultValueSelectorProps) {
  const onModeChange = useCallback(
    (mode: 'value' | 'sql' | 'none' | 'null') => {
      onChange({ mode, value: value.value })
    },
    [onChange, value.value],
  )

  const onValueChange = useCallback(
    (newValue: string) => {
      onChange({ mode: value.mode, value: newValue })
    },
    [onChange, value.mode],
  )
  return (
    <div className="grid w-full grid-cols-[auto_1fr]">
      <Select onValueChange={onModeChange} value={value.mode} disabled={disabled}>
        <SelectTrigger className="-mr-[1px] w-28 rounded-r-none focus:z-20">
          <SelectValue placeholder="Select a mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="value">{formType}</SelectItem>
          <SelectItem value="sql">SQL</SelectItem>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="null">null</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="rounded-l-none focus:z-20"
        disabled={disabled || value.mode === 'none' || value.mode === 'null'}
        value={value.mode === 'null' ? 'null' : value.value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={
          value.mode === 'none'
            ? 'No default value'
            : value.mode === 'null'
              ? 'null'
              : `Enter ${value.mode} here`
        }
      />
    </div>
  )
}
