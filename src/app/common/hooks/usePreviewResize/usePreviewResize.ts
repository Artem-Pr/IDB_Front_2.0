/* eslint functional/immutable-data: 0 */
import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import { setPreviewSize } from '../../../../redux/reducers/sessionSlice-reducer'

export const usePreviewResize = () => {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<(HTMLDivElement | null)[]>([])
  const dispatch = useDispatch()

  const onSliderMove = (currentHeight: number) => {
    gridRef.current && (gridRef.current.style.gridTemplateColumns = `repeat(auto-fill,minmax(${currentHeight}px, 1fr))`)
    imgRef.current?.forEach(ref => {
      ref && (ref.style.height = `${currentHeight}px`)
    })
  }

  const finishPreviewResize = (currentHeight: number) => {
    dispatch(setPreviewSize(currentHeight))
  }

  return { gridRef, imgRef, onSliderMove, finishPreviewResize }
}
