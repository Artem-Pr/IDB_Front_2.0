import {
  useMemo, useEffect, useRef, useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getMainPageReducerIsGalleryLoading } from 'src/redux/reducers/mainPageSlice/selectors'
import { sessionReducerSetPreviewSize, sessionReducerSetTriggerScrollUp } from 'src/redux/reducers/sessionSlice'
import { getSessionReducerTriggerScrollUp } from 'src/redux/reducers/sessionSlice/selectors'
import { getSort } from 'src/redux/selectors'

export const useGridRefControl = () => {
  const gridRef = useRef<(HTMLDivElement | null)[]>([])
  const imgRef = useRef<(HTMLDivElement | null)[]>([])
  const imgFirstGroupNameRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const isGalleryLoading = useSelector(getMainPageReducerIsGalleryLoading)
  const { groupedByDate } = useSelector(getSort)
  const triggerScrollUp = useSelector(getSessionReducerTriggerScrollUp)

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
      dispatch(sessionReducerSetTriggerScrollUp(false))
    }

    triggerScrollUp && !isGalleryLoading && scrollToTop()
  }, [isGalleryLoading, groupedByDate, triggerScrollUp, dispatch])

  const onSliderMove = useCallback((currentHeight: number) => {
    gridRef.current?.forEach(ref => {
      ref && (ref.style.gridTemplateColumns = `repeat(auto-fill,minmax(${currentHeight}px, 1fr))`)
    })

    imgRef.current?.forEach(ref => {
      ref && (ref.style.height = `${currentHeight}px`)
    })
  }, [])

  const finishPreviewResize = useCallback((currentHeight: number) => {
    dispatch(sessionReducerSetPreviewSize(currentHeight))
  }, [dispatch])

  return {
    refs,
    onSliderMove,
    finishPreviewResize,
  }
}
