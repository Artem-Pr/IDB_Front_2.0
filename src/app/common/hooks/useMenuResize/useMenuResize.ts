import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import throttle from 'lodash.throttle'

import { sessionReducerSetAsideMenuWidth } from 'src/redux/reducers/sessionSlice'

const MIN_ASIDE_WIDTH = 200
const THROTTLE_TIME = 50

interface UpdateWithProps {
  oldWidth: string
  pageX: number
  menuRef: React.MutableRefObject<HTMLDivElement | null>
  videoPreviewRef: React.MutableRefObject<HTMLDivElement | null>
}

interface ApplyNewWidthProps extends Omit<UpdateWithProps, 'oldWidth'> {
  oldWidthNumber: number
}

const applyNewWidth = ({
  pageX, menuRef, videoPreviewRef,
}: ApplyNewWidthProps) => {
  const newWidth = `${pageX}px`
  menuRef.current && (menuRef.current.style.width = newWidth)
  menuRef.current && (menuRef.current.style.flexBasis = newWidth)
  menuRef.current && (menuRef.current.style.maxWidth = newWidth)
  videoPreviewRef.current && (videoPreviewRef.current.style.height = newWidth)
}

const updateWidth = ({
  oldWidth, pageX, menuRef, videoPreviewRef,
}: UpdateWithProps): void => {
  const oldWidthNumber = parseInt(oldWidth, 10)
  const widthIsBiggerThenMin = oldWidthNumber > MIN_ASIDE_WIDTH || pageX > 0
  widthIsBiggerThenMin && applyNewWidth({
    oldWidthNumber, pageX, menuRef, videoPreviewRef,
  })
}

export const useMenuResize = () => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const videoPreviewRef = useRef<HTMLDivElement | null>(null)
  const handleUpdateWidth = useCallback((pageX : number) => {
    const width = menuRef.current?.style.width
    width && updateWidth({
      oldWidth: width, pageX, menuRef, videoPreviewRef,
    })
  }, [])

  const handleDividerMove = useRef(throttle(handleUpdateWidth, THROTTLE_TIME)).current
  const dispatch = useDispatch()

  const handleFinishResize = useCallback(() => {
    dispatch(sessionReducerSetAsideMenuWidth(parseInt(menuRef.current?.style.width || '0', 10)))
  }, [dispatch])

  return {
    menuRef, videoPreviewRef, handleDividerMove, handleFinishResize,
  }
}
