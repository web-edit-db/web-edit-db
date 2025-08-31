import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { IconRotate, IconTrash, IconTrashOff } from '@tabler/icons-react'
import type { ModifiedState } from './types'

interface ColumnCardHeaderProps {
  columnName: string
  modifiedState: ModifiedState
  isDeleted: boolean
  isNew: boolean
  isResetDisabled: boolean
  onReset: () => void
  onToggleDeleted: () => void
}

export default function ColumnCardHeader({
  columnName,
  modifiedState,
  isDeleted,
  isNew,
  isResetDisabled,
  onReset,
  onToggleDeleted,
}: ColumnCardHeaderProps) {
  const modifiedStateColor = (() => {
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
  })()

  return (
    <CardHeader className="px-4">
      <div className="row flex items-center justify-between">
        <span>{columnName}</span>
        <span className={cn('select-none', modifiedStateColor)}>{modifiedState}</span>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  disabled={isResetDisabled}
                  type="button"
                >
                  <IconRotate />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleDeleted} type="button">
                {isDeleted ? <IconTrashOff /> : <IconTrash />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDeleted ? 'Restore' : 'Delete'}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </CardHeader>
  )
}
