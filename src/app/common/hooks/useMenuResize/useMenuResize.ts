/* eslint-disable no-param-reassign */
import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import throttle from 'lodash.throttle'

import { sessionReducerSetAsideMenuWidth } from 'src/redux/reducers/sessionSlice'

const MIN_ASIDE_WIDTH = 200
const THROTTLE_TIME = 10

interface UpdateWithProps {
  oldWidth: string
  moveX: number
  menuRef: React.MutableRefObject<HTMLDivElement | null>
  videoPreviewRef: React.MutableRefObject<HTMLDivElement | null>
}

interface ApplyNewWidthProps extends Omit<UpdateWithProps, 'oldWidth'> {
  oldWidthNumber: number
}

// let xMovement = 0

const applyNewWidth = ({
  oldWidthNumber, moveX, menuRef, videoPreviewRef,
}: ApplyNewWidthProps) => {
  // console.log('🚀 ~ moveX:', moveX)
  // const newWidth = `${xMovement}px`
  const newWidth = `${oldWidthNumber + moveX}px`
  menuRef.current && (menuRef.current.style.width = newWidth)
  menuRef.current && (menuRef.current.style.flexBasis = newWidth)
  menuRef.current && (menuRef.current.style.maxWidth = newWidth)
  videoPreviewRef.current && (videoPreviewRef.current.style.height = newWidth)
}

const updateWidth = ({
  oldWidth, moveX, menuRef, videoPreviewRef,
}: UpdateWithProps): void => {
  const oldWidthNumber = parseInt(oldWidth, 10)
  const widthIsBiggerThenMin = oldWidthNumber > MIN_ASIDE_WIDTH || moveX > 0
  widthIsBiggerThenMin && applyNewWidth({
    oldWidthNumber, moveX, menuRef, videoPreviewRef,
  })
}

export const useMenuResize = () => {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const videoPreviewRef = useRef<HTMLDivElement | null>(null)
  const handleDividerMove = useRef(
    throttle((moveX: number) => {
      const width = menuRef.current?.style.width
      width && updateWidth({
        oldWidth: width, moveX, menuRef, videoPreviewRef,
      })
    }, THROTTLE_TIME),
  ).current
  // const handleDividerMove = useRef(
  //   (x: number) => {
  //     xMovement += x
  //     // console.log('🚀 ~ throttle ~ width:', xMovement)

  //     return throttle(() => {
  //       const width = menuRef.current?.style.width
  //       console.log('🚀 ~ throttle ~ width:', width)
  //       width && updateWidth({
  //         oldWidth: width, moveX: xMovement, menuRef, videoPreviewRef,
  //       })
  //     }, THROTTLE_TIME)()
  //   },
  // ).current
  const dispatch = useDispatch()

  const handleFinishResize = useCallback(() => {
    dispatch(sessionReducerSetAsideMenuWidth(parseInt(menuRef.current?.style.width || '0', 10)))
  }, [dispatch])

  return {
    menuRef, videoPreviewRef, handleDividerMove, handleFinishResize,
  }
}
