/* eslint functional/immutable-data: 0 */
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setPreviewSize } from '../../../../redux/reducers/sessionSlice-reducer'
import { main } from '../../../../redux/selectors'

export const useGridRefControl = () => {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<(HTMLDivElement | null)[]>([])
  const dispatch = useDispatch()
  const { isGalleryLoading } = useSelector(main)
  const [scrollUpWhenUpdating, setScrollUpWhenUpdating] = useState(true)

  useEffect(() => {
    scrollUpWhenUpdating && !isGalleryLoading && gridRef.current?.scrollIntoView()
  }, [gridRef, isGalleryLoading, scrollUpWhenUpdating])

  const onSliderMove = (currentHeight: number) => {
    gridRef.current && (gridRef.current.style.gridTemplateColumns = `repeat(auto-fill,minmax(${currentHeight}px, 1fr))`)
    imgRef.current?.forEach(ref => {
      ref && (ref.style.height = `${currentHeight}px`)
    })
  }

  const finishPreviewResize = (currentHeight: number) => {
    dispatch(setPreviewSize(currentHeight))
  }

  return { gridRef, imgRef, onSliderMove, finishPreviewResize, setScrollUpWhenUpdating }
}
