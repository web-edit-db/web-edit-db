import { Button } from '@/components/ui/button'
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'

interface ToggleButtonProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  className?: string
}

export default function ToggleButton({
  checked,
  onChange,
  disabled,
  label,
  className,
}: ToggleButtonProps) {
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
