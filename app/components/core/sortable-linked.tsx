import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'

import { cn } from '@/lib/utils'

interface SortableLinkedProps {
  className?: string
}

const SortableItem = ({
  item,
  big,
  inMotion,
}: {
  item: { id: string; content: string }
  big: boolean
  inMotion: boolean
}) => {
  const { listeners, setNodeRef, transform, isDragging, data, isSorting } = useSortable({
    id: item.id,
    data: {
      id: item.id,
    },
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <motion.div
      ref={setNodeRef}
      layout
      //   initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
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
      className={cn(
        'bg-card border-card-foreground cursor-grab rounded-md border-1 p-3 active:cursor-grabbing',
        big && 'p-10',
        isDragging ||
          (inMotion && !isSorting && 'ring-primary z-20 shadow-xl ring-1 ring-offset-2'),
      )}
      {...listeners}
    >
      {item.content}
    </motion.div>
  )
}

export const SortableLinked = ({ className }: SortableLinkedProps) => {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
    { id: '4', content: 'Item 4' },
    { id: '5', content: 'Item 5' },
    { id: '6', content: 'Item 6' },
    { id: '7', content: 'Item 7' },
  ])

  // list of indexes one for each item
  const [previewOrder, setPreviewOrder] = useState<[string, number][]>([])

  useMemo(() => {
    // this will reset the preview order when the items change
    setPreviewOrder(items.map((item, index) => [item.id, index] as const))
  }, [items])

  const [activeItem, setActiveItem] = useState<{ id: string; content: string } | null>(null)

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      // as the order changes, we need to update the preview order
      console.log('handleDragMove')
      console.log(event)
      const { active, over } = event
      const oldIndex = previewOrder.findIndex(([id]) => id === active.id)
      const newIndex = items.findIndex((item) => item.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setItems(arrayMove(items, oldIndex, newIndex))
      }
    },
    [previewOrder, items],
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const item = items.find((item) => item.id === active.id)
      setActiveItem(item || null)
    },
    [items],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.log('handleDragEnd')
      const { active, over } = event

      setActiveItem(null)

      if (!over || active.id === over.id) return

      if (items.find((item) => item.id === active.id)) {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          setItems(arrayMove(items, oldIndex, newIndex))
        }
      }
    },
    [items],
  )

  const itemsLeft = useMemo(() => {
    return items
  }, [items])

  const itemsRight = useMemo(() => {
    return items
  }, [items])

  return (
    <div className={cn('flex gap-6', className)}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        {/* Left Side */}
        <SortableContext
          items={itemsLeft.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-card flex min-h-[400px] w-full max-w-sm flex-col rounded-lg border p-4 shadow-sm">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">Left</h3>
            <div className="border-muted-foreground/25 flex min-h-[300px] flex-1 flex-col gap-2 rounded-md border-2 border-dashed p-2">
              <AnimatePresence>
                {itemsLeft.map((item) => (
                  <motion.div
                    key={item.id}
                    // initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SortableItem item={item} big={true} inMotion={activeItem?.id === item.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeItem && <SortableItem item={activeItem} big={true} inMotion={true} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        {/* Right Side */}
        <SortableContext
          items={itemsRight.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-card flex min-h-[400px] w-full max-w-sm flex-col rounded-lg border p-4 shadow-sm">
            <h3 className="text-card-foreground mb-4 text-lg font-semibold">Right</h3>
            <div className="border-muted-foreground/25 flex min-h-[300px] flex-1 flex-col gap-2 rounded-md border-2 border-dashed p-2">
              <AnimatePresence>
                {itemsRight.map((item) => (
                  <motion.div
                    key={item.id}
                    // initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SortableItem item={item} big={false} inMotion={activeItem?.id === item.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeItem && <SortableItem item={activeItem} big={false} inMotion={false} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
      {JSON.stringify(items)}
    </div>
  )
}
