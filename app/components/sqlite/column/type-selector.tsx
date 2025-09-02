import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { columnTypes } from './types'
import { useCallback, useMemo } from 'react'

interface TypeSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function TypeSelector({ value, onChange, disabled }: TypeSelectorProps) {
  const formatTitle = useCallback((type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }, [])
  const displayOther = useMemo(() => {
    return !([...columnTypes] as string[]).includes(value)
  }, [value])
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {columnTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {formatTitle(type)}
          </SelectItem>
        ))}
        {displayOther && (
          <SelectItem key="other" value={value} disabled>
            {value}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
