/* eslint functional/immutable-data: 0 */
import { useMemo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setPreviewSize } from '../../../../redux/reducers/sessionSlice-reducer'
import { main, sort } from '../../../../redux/selectors'

export const useGridRefControl = () => {
  const gridRef = useRef<(HTMLDivElement | null)[]>([])
  const imgRef = useRef<(HTMLDivElement | null)[]>([])
  const imgFirstGroupNameRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const { isGalleryLoading } = useSelector(main)
  const { groupedByDate } = useSelector(sort)
  const [scrollUpWhenUpdating, setScrollUpWhenUpdating] = useState(true)

  const refs = useMemo(
    () => ({
      gridRef,
      imgRef,
      imgFirstGroupNameRef,
    }),
    []
  )

  useEffect(() => {
    const scrollToTop = () => {
      groupedByDate ? imgFirstGroupNameRef.current?.scrollIntoView() : gridRef.current[0]?.scrollIntoView()
    }

    scrollUpWhenUpdating && !isGalleryLoading && scrollToTop()
  }, [isGalleryLoading, scrollUpWhenUpdating, groupedByDate])

  const onSliderMove = (currentHeight: number) => {
    gridRef.current?.forEach(ref => {
      ref && (ref.style.gridTemplateColumns = `repeat(auto-fill,minmax(${currentHeight}px, 1fr))`)
    })

    imgRef.current?.forEach(ref => ref && (ref.style.height = `${currentHeight}px`))
  }

  const finishPreviewResize = (currentHeight: number) => {
    dispatch(setPreviewSize(currentHeight))
  }

  return {
    refs,
    onSliderMove,
    finishPreviewResize,
    setScrollUpWhenUpdating,
  }
}
