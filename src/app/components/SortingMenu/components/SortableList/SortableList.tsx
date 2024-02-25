import React, { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { Active, UniqueIdentifier, Over } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { SortableOverlay } from './components'

import styles from './SortableList.module.scss'

interface BaseItem {
  id: UniqueIdentifier
}

interface Props<T extends BaseItem> {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T) => ReactNode
}

export const SortableList = <T extends BaseItem>({ items, onChange, renderItem }: Props<T>) => {
  const [activeElem, setActiveElem] = useState<Active | null>(null)
  const activeItem = useMemo(() => items.find(item => item.id === activeElem?.id), [activeElem, items])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const updateArrayAfterMoving = () => {
      const activeIndex = items.findIndex(({ id }) => id === active.id)
      const overIndex = items.findIndex(({ id }) => id === (over as Over).id)

      onChange(arrayMove(items, activeIndex, overIndex))
    }

    const isItemPlaceUpdated = over && active.id !== over?.id
    isItemPlaceUpdated && updateArrayAfterMoving()
    setActiveElem(null)
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveElem(active)
  }

  const handleDragCancel = () => {
    setActiveElem(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items}>
        <ul className={styles.SortableList} role="application">
          {items.map(item => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
    </DndContext>
  )
}
