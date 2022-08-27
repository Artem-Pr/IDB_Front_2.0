/* eslint functional/immutable-data: 0 */
import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import { setAsideMenuWidth } from '../../../../redux/reducers/sessionSlice-reducer'

const MIN_ASIDE_WIDTH = 200

export const useMenuResize = () => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()

  const handleDividerMove = (moveX: number) => {
    const applyNewWidth = (oldWidthNumber: number) => {
      const newWidth = `${oldWidthNumber + moveX}px`
      menuRef.current && (menuRef.current.style.width = newWidth)
      menuRef.current && (menuRef.current.style.flexBasis = newWidth)
      menuRef.current && (menuRef.current.style.maxWidth = newWidth)
    }

    const updateWidth = (oldWidth: string) => {
      const oldWidthNumber = parseInt(oldWidth)
      const widthIsBiggerThenMin = oldWidthNumber > MIN_ASIDE_WIDTH || moveX > 0
      widthIsBiggerThenMin && applyNewWidth(oldWidthNumber)
    }

    const width = menuRef.current?.style.width
    width && updateWidth(width)
  }

  const handleFinishResize = () => {
    dispatch(setAsideMenuWidth(parseInt(menuRef.current?.style.width || '0')))
  }

  return { menuRef, handleDividerMove, handleFinishResize }
}
