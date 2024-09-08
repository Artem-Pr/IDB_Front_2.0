import { useCallback, useMemo, useState } from 'react'

import { Tags } from 'exiftool-vendored'

import type { GalleryTileProps } from '../../components/GalleryTile/GalleryTile'

import { getExifListJSX } from './helpers'

export const useGetFullExifList = () => {
  const [exif, setExif] = useState<Tags>()
  const [showExifModal, setShowExifModal] = useState(false)
  const [isJSONMode, setIsJSONMode] = useState(false)

  const renderedExif = useMemo(() => getExifListJSX(exif, isJSONMode), [exif, isJSONMode])

  const showExifList: GalleryTileProps['showExifList'] = newExif => {
    setExif(newExif)
    setShowExifModal(true)
  }

  const handleCloseExifModal = useCallback(() => {
    setShowExifModal(false)
  }, [])

  return {
    handleCloseExifModal,
    isJSONMode,
    renderedExif,
    setIsJSONMode,
    showExifList,
    showExifModal,
  }
}
