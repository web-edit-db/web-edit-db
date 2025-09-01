import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  DragOverlay,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  type SortingStrategy,
} from '@dnd-kit/sortable'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSensor, useSensors } from '@dnd-kit/core'
import { MouseSensor } from '@dnd-kit/core'
import { TouchSensor } from '@dnd-kit/core'
import { KeyboardSensor } from '@dnd-kit/core'

interface SortableLinkedProps {
  className?: string
}

const ringStyle = 'ring-primary/40 z-20 shadow-xl ring-2 ring-offset-2'

export const SortableGroupItem = ({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className?: string
}) => {
  const { activeItem } = useSortableGroup()
  const isSortingGroup = useMemo(() => activeItem !== null, [activeItem])
  const relatedBeingDragged = useMemo(() => activeItem?.id === id, [activeItem, id])
  const { listeners, setNodeRef, transform, isDragging, isSorting } = useSortable({
    id,
    data: {
      id,
    },
  })

  const showRing = useMemo(
    () => isDragging || (relatedBeingDragged && !isSorting),
    [isDragging, isSorting, relatedBeingDragged],
  )

  // const dimOthers = useMemo(
  //   () => isSortingGroup && !relatedBeingDragged,
  //   [isSortingGroup, relatedBeingDragged],
  // )

  const opacity = useMemo(() => {
    if (isDragging) return 0.8
    if (relatedBeingDragged) return 0.8
    if (isSortingGroup && !relatedBeingDragged) return 0.5
    return 1
  }, [isDragging, isSortingGroup, relatedBeingDragged])

  return (
    <motion.div
      key={id}
      ref={setNodeRef}
      layout
      animate={{
        opacity: opacity,
        scale: isDragging ? 0.95 : 1,
        y: transform?.y ?? 0,
        x: transform?.x ?? 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={cn(className, showRing && ringStyle)}
      {...listeners}
    >
      {children}
    </motion.div>
  )
}

export const SortableGroupItemOverlay = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <DragOverlay>
      <div className={cn(className, ringStyle)}>{children}</div>
    </DragOverlay>
  )
}

type UniqueItem = { id: UniqueIdentifier }
const dndGroupContext = createContext<{
  activeItem: UniqueItem | null
  dragStart: (event: DragStartEvent) => void
  dragMove: (event: DragMoveEvent) => void
  dragEnd: (event: DragEndEvent) => void
  items: UniqueItem[]
}>({
  activeItem: null,
  dragStart: () => {},
  dragMove: () => {},
  dragEnd: () => {},
  items: [],
})

export const SortableGroupContext = <T extends UniqueItem>({
  children,
  items,
  setItems,
}: {
  children: React.ReactNode
  items: T[]
  setItems: (items: T[]) => void
}) => {
  const [activeItem, setActiveItem] = useState<T | null>(null)
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const item = items.find((item) => item.id === active.id)
      setActiveItem(item || null)
    },
    [items],
  )

  const handleDragMoveOrEnd = useCallback(
    (event: DragMoveEvent | DragEndEvent) => {
      const { active, over } = event

      if (!over) return

      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setItems(arrayMove(items, oldIndex, newIndex))
      }
    },
    [items, setItems],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveItem(null)
      handleDragMoveOrEnd(event)
    },
    [setActiveItem, handleDragMoveOrEnd],
  )

  return (
    <dndGroupContext.Provider
      value={{
        activeItem,
        dragStart: handleDragStart,
        dragMove: handleDragMoveOrEnd,
        dragEnd: handleDragEnd,
        items,
      }}
    >
      {children}
    </dndGroupContext.Provider>
  )
}

const useSortableGroup = () => {
  return useContext(dndGroupContext)
}

export const SortableGroupItemContext = ({
  children,
  overlay,
  strategy = verticalListSortingStrategy,
}: {
  children: React.ReactNode
  overlay: (activeItem: UniqueItem) => React.ReactNode
  strategy?: SortingStrategy
}) => {
  const { activeItem, dragStart, dragMove, dragEnd, items } = useSortableGroup()

  // Configure sensors with distance constraint for mouse/touch while preserving keyboard accessibility
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8, // 8px threshold before drag starts
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms delay for touch devices
      tolerance: 8, // 8px tolerance for touch
    },
  })

  // Preserve keyboard sensor for accessibility (no constraints needed)
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  return (
    <DndContext sensors={sensors} onDragStart={dragStart} onDragMove={dragMove} onDragEnd={dragEnd}>
      <SortableContext items={items} strategy={strategy}>
        {children}
      </SortableContext>
      {createPortal(activeItem && overlay(activeItem), document.body)}
    </DndContext>
  )
}

const ExampleLinkedItem = ({
  item,
  big,
}: {
  item: { id: string; content: string }
  big: boolean
}) => {
  return (
    <div
      className={cn(
        'bg-card border-card-foreground cursor-grab rounded-md border-1 p-3 active:cursor-grabbing',
        big && 'p-10',
      )}
    >
      {item.content}
    </div>
  )
}

const ExampleLinkedCard = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="bg-card flex min-h-[400px] w-full max-w-sm flex-col rounded-lg border p-4 shadow-sm">
      <h3 className="text-card-foreground mb-4 text-lg font-semibold">{title}</h3>
      <div className="border-muted-foreground/25 flex min-h-[300px] flex-1 flex-col gap-2 rounded-md border-2 border-dashed p-2">
        {children}
      </div>
    </div>
  )
}

export const ExampleLinked = ({ className }: SortableLinkedProps) => {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
    { id: '5', content: 'Item 5' },
    { id: '6', content: 'Item 6' },
    { id: '7', content: 'Item 7' },
  ])

  const getOverlay = (activeItem: UniqueItem, big: boolean) => {
    const overlayItem = items.find((item) => item.id === activeItem.id)

    if (overlayItem) {
      return (
        <SortableGroupItemOverlay className={'rounded-md'}>
          <ExampleLinkedItem item={overlayItem} big={big} />
        </SortableGroupItemOverlay>
      )
    }
    return null
  }

  const appendItem = useCallback(() => {
    setItems([...items, { id: `${items.length + 1}`, content: `Item ${items.length + 1}` }])
  }, [items])

  const removeItem = useCallback(() => {
    setItems(items.slice(0, -1))
  }, [items])

  return (
    <div className={cn('flex gap-6', className)}>
      <SortableGroupContext items={items} setItems={setItems}>
        <SortableGroupItemContext overlay={(activeItem) => getOverlay(activeItem, true)}>
          <ExampleLinkedCard title="Left">
            <AnimatePresence>
              {items.map((item) => (
                <SortableGroupItem key={item.id} id={item.id} className={'rounded-md'}>
                  <ExampleLinkedItem item={item} big={true} />
                </SortableGroupItem>
              ))}
            </AnimatePresence>
          </ExampleLinkedCard>
        </SortableGroupItemContext>
        <SortableGroupItemContext overlay={(activeItem) => getOverlay(activeItem, false)}>
          <ExampleLinkedCard title="Right">
            <AnimatePresence>
              {items.map((item) => (
                <SortableGroupItem key={item.id} id={item.id} className={'rounded-md'}>
                  <ExampleLinkedItem item={item} big={false} />
                </SortableGroupItem>
              ))}
            </AnimatePresence>
          </ExampleLinkedCard>
        </SortableGroupItemContext>
      </SortableGroupContext>
      <div className="flex flex-col gap-2">
        <Button onClick={appendItem}>Add Item</Button>
        <Button onClick={removeItem}>Remove Item</Button>
      </div>
      {/* {JSON.stringify(items)} */}
    </div>
  )
}
