/* eslint-disable no-param-reassign */
import {
  useMemo, useEffect, useRef, useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getMainPageReducerIsGalleryLoading } from 'src/redux/reducers/mainPageSlice/selectors'
import { sessionReducerSetPreviewSize } from 'src/redux/reducers/sessionSlice'
import { getSort } from 'src/redux/selectors'

export const useGridRefControl = () => {
  const gridRef = useRef<(HTMLDivElement | null)[]>([])
  const imgRef = useRef<(HTMLDivElement | null)[]>([])
  const imgFirstGroupNameRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const isGalleryLoading = useSelector(getMainPageReducerIsGalleryLoading)
  const { groupedByDate } = useSelector(getSort)
  const [scrollUpWhenUpdating, setScrollUpWhenUpdating] = useState(true)

  const refs = useMemo(
    () => ({
      gridRef,
      imgRef,
      imgFirstGroupNameRef,
    }),
    [],
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

    imgRef.current?.forEach(ref => {
      ref && (ref.style.height = `${currentHeight}px`)
    })
  }

  const finishPreviewResize = (currentHeight: number) => {
    dispatch(sessionReducerSetPreviewSize(currentHeight))
  }

  return {
    refs,
    onSliderMove,
    finishPreviewResize,
    setScrollUpWhenUpdating,
  }
}
