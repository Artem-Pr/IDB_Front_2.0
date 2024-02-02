import {
  MouseEvent, useCallback, useMemo, useState,
} from 'react'

import type { ExifFilesList } from '../../../../../redux/types'

import { getExifListJSX } from './helpers'

interface UseGetFullExifList {
  fullExifFilesList: ExifFilesList
  updateFiles: (tempPath: string) => void
}

export const useGetFullExifList = ({ fullExifFilesList, updateFiles }: UseGetFullExifList) => {
  const [currentTempPath, setCurrentTempPath] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isJSONMode, setIsJSONMode] = useState(false)
  const exif = useMemo(
    () => getExifListJSX(fullExifFilesList, currentTempPath, isJSONMode),
    [fullExifFilesList, currentTempPath, isJSONMode],
  )

  const getExif = useCallback(
    (tempPath: string) => (e: MouseEvent) => {
      e.stopPropagation()
      !fullExifFilesList[tempPath] && updateFiles(tempPath)
      setCurrentTempPath(tempPath)
      setShowModal(true)
    },
    [fullExifFilesList, updateFiles],
  )

  const handleShowModalClose = useCallback(() => {
    setShowModal(false)
  }, [])

  return {
    getExif,
    showModal,
    handleShowModalClose,
    exif,
    setIsJSONMode,
    isJSONMode,
  }
}
