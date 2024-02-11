import {
  MouseEvent, useCallback, useMemo, useState,
} from 'react'

import type {
  Defined,
  ExifFilesList, GPSCoordinates, RawFullExifObj,
} from 'src/redux/types'

import { getExifListJSX } from './helpers'

const isGPSExist = <T extends ({ GPSLatitude: number; GPSLongitude: number } | RawFullExifObj | undefined)>(
  GPS: T,
): GPS is Defined<T> => Boolean(GPS?.GPSLatitude && GPS?.GPSLongitude)

export type GetCoordinates = (tempPath: string) => GPSCoordinates | undefined

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
  const getGPSCoordinates: GetCoordinates = useCallback((tempPath: string) => {
    const exifObject = fullExifFilesList[tempPath]

    return isGPSExist(exifObject)
      ? {
        GPSLatitude: exifObject.GPSLatitude,
        GPSLongitude: exifObject.GPSLongitude,
      }
      : undefined
  }, [fullExifFilesList])

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
    exif,
    getExif,
    getGPSCoordinates,
    handleShowModalClose,
    isJSONMode,
    setIsJSONMode,
    showModal,
  }
}
