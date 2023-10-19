/* eslint functional/immutable-data: 0 */
import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { throttle } from 'lodash'

import { setAsideMenuWidth } from '../../../../redux/reducers/sessionSlice-reducer'

const MIN_ASIDE_WIDTH = 200
const THROTTLE_TIME = 10

const applyNewWidth = (
  oldWidthNumber: number,
  moveX: number,
  menuRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  const newWidth = `${oldWidthNumber + moveX}px`
  menuRef.current && (menuRef.current.style.width = newWidth)
  menuRef.current && (menuRef.current.style.flexBasis = newWidth)
  menuRef.current && (menuRef.current.style.maxWidth = newWidth)
}

const updateWidth = (oldWidth: string, moveX: number, menuRef: React.MutableRefObject<HTMLDivElement | null>) => {
  const oldWidthNumber = parseInt(oldWidth)
  const widthIsBiggerThenMin = oldWidthNumber > MIN_ASIDE_WIDTH || moveX > 0
  widthIsBiggerThenMin && applyNewWidth(oldWidthNumber, moveX, menuRef)
}

export const useMenuResize = () => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const handleDividerMove = useRef(
    throttle((moveX: number) => {
      const width = menuRef.current?.style.width
      width && updateWidth(width, moveX, menuRef)
    }, THROTTLE_TIME)
  ).current
  const dispatch = useDispatch()

  const handleFinishResize = useCallback(() => {
    dispatch(setAsideMenuWidth(parseInt(menuRef.current?.style.width || '0')))
  }, [dispatch])

  return { menuRef, handleDividerMove, handleFinishResize }
}
