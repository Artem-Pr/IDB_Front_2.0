import { useCallback, useEffect, useState } from 'react'

import { difference, range, sort } from 'ramda'

import { getLastItem } from 'src/app/common/utils'

interface UseSelectWithShift {
  selectedList: number[]
  isTemplateMenu: boolean
  addToSelectedList: (indexArr: number[]) => void
  removeFromSelectedList: (index: number[]) => void
}

export const useSelectWithShift = ({
  selectedList,
  isTemplateMenu,
  addToSelectedList,
  removeFromSelectedList,
}: UseSelectWithShift) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.shiftKey && setIsShiftPressed(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      e.key === 'Shift' && setIsShiftPressed(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }
  }, [])

  const isShiftHover = useCallback(
    (i: number) => {
      const isHover = () => {
        const lastSelectedElemIndex = getLastItem(selectedList)
        const currentHoveredIndex = hoveredIndex === null ? lastSelectedElemIndex : hoveredIndex
        const sortedTouple = sort((a, b) => a - b, [currentHoveredIndex, lastSelectedElemIndex])
        const hoverList = range(sortedTouple[0], sortedTouple[1] + 1)
        return hoverList.includes(i)
      }

      return isTemplateMenu && isShiftPressed && hoveredIndex !== null && !!selectedList.length && isHover()
    },
    [hoveredIndex, isShiftPressed, isTemplateMenu, selectedList],
  )

  const selectWithShift = useCallback(
    (lastSelectedElemIndex: number) => {
      const currentHoveredIndex = hoveredIndex === null ? lastSelectedElemIndex : hoveredIndex
      const currentLastSelectedElemIndex = lastSelectedElemIndex === undefined
        ? (hoveredIndex as number)
        : lastSelectedElemIndex
      const sortedTouple = sort((a, b) => a - b, [currentHoveredIndex, currentLastSelectedElemIndex])
      const hoverList = range(sortedTouple[0], sortedTouple[1] + 1)
      const alreadySelectedItems = difference(hoverList, selectedList)
      alreadySelectedItems.length ? addToSelectedList(hoverList) : removeFromSelectedList(hoverList)
      setHoveredIndex(null)
    },
    [addToSelectedList, hoveredIndex, removeFromSelectedList, selectedList],
  )

  return {
    hoveredIndex,
    setHoveredIndex,
    isShiftPressed,
    isShiftHover,
    selectWithShift,
  }
}
