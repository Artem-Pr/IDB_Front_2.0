import { useEffect, useState } from 'react'

import { range, sort } from 'ramda'

import { getLastItem } from '../../../common/utils'

export const useSelectWithShift = (selectedList: number[], isTemplateMenu: boolean) => {
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

  const isShiftHover = (i: number) => {
    const isHover = () => {
      const lastSelectedElemIndex = getLastItem(selectedList)
      const currentHoveredIndex = hoveredIndex === null ? lastSelectedElemIndex : hoveredIndex
      const sortedTouple = sort((a, b) => a - b, [currentHoveredIndex, lastSelectedElemIndex])
      const hoverList = range(sortedTouple[0], sortedTouple[1] + 1)
      return hoverList.includes(i)
    }

    return isTemplateMenu && isShiftPressed && hoveredIndex !== null && !!selectedList.length && isHover()
  }

  return {
    hoveredIndex,
    setHoveredIndex,
    isShiftPressed,
    isShiftHover,
  }
}
