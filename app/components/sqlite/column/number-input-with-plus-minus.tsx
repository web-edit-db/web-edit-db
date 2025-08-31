import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'

interface NumberInputWithPlusMinusProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  disabled?: boolean
}

export default function NumberInputWithPlusMinus({
  value,
  onChange,
  disabled,
}: NumberInputWithPlusMinusProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? '')

  useEffect(() => {
    setInputValue(value?.toString() ?? '')
  }, [value])

  // this is to avoid a race condition between the value and the onChange callback
  const setInputValueAndOnChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue)

      const inputValueTrimmed = newValue.trim()

      if (inputValueTrimmed === '' || inputValueTrimmed === '-') {
        onChange(undefined)
      } else {
        const numValue = Number(inputValueTrimmed)
        if (Number.isNaN(numValue)) {
          onChange(undefined)
        } else {
          onChange(numValue)
        }
      }
    },
    [onChange],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // prevent the user entering anything that is not a number, -, or ., remove any non-numeric characters
    const newValue = e.target.value.replace(/[^0-9.-]/g, '')
    if (newValue === '') {
      setInputValueAndOnChange('')
    } else {
      setInputValueAndOnChange(newValue)
    }
  }

  const onMinus = useCallback(() => {
    // first try and turn this into a number
    const newValue = inputValue === '' ? Number.NaN : Number(inputValue)
    if (Number.isNaN(newValue)) {
      setInputValueAndOnChange('0')
    } else {
      setInputValueAndOnChange((newValue - 1).toString())
    }
  }, [inputValue, setInputValueAndOnChange])

  const onPlus = useCallback(() => {
    const newValue = inputValue === '' ? Number.NaN : Number(inputValue)
    if (Number.isNaN(newValue)) {
      setInputValueAndOnChange('0')
    } else {
      setInputValueAndOnChange((newValue + 1).toString())
    }
  }, [inputValue, setInputValueAndOnChange])

  const onClear = useCallback(() => {
    setInputValueAndOnChange('')
  }, [setInputValueAndOnChange])

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
        type="button"
        variant="outline"
        disabled={disabled}
        className="-ml-[1px] rounded-l-none rounded-r-none focus:z-20"
      >
        <IconMinus />
      </Button>
      <Button
        onClick={onPlus}
        size="icon"
        type="button"
        variant="outline"
        disabled={disabled}
        className="-ml-[1px] rounded-l-none rounded-r-none focus:z-20"
      >
        <IconPlus />
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
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
