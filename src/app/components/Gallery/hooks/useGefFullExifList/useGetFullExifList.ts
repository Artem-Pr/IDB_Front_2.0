import {
  MouseEvent, useCallback, useMemo, useState,
} from 'react'

import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'
import type {
  Defined,
  ExifFilesList,
  GPSCoordinates,
} from 'src/redux/types'

import { getExifListJSX } from './helpers'

const isGPSExist = <T extends (Pick<Tags, 'GPSLatitude' | 'GPSLongitude'> | Tags | undefined)>(
  GPS: T,
): GPS is Defined<T> => Boolean(GPS?.GPSLatitude && GPS?.GPSLongitude)

export type GetCoordinates = (id: Media['id']) => GPSCoordinates | undefined

interface UseGetFullExifList {
  fullExifFilesList: ExifFilesList
}

export const useGetFullExifList = ({ fullExifFilesList }: UseGetFullExifList) => {
  const [currentId, setCurrentId] = useState<Media['id']>('')
  const [showModal, setShowModal] = useState(false)
  const [isJSONMode, setIsJSONMode] = useState(false)
  const exif = useMemo(
    () => getExifListJSX(fullExifFilesList, currentId, isJSONMode),
    [fullExifFilesList, currentId, isJSONMode],
  )
  const getGPSCoordinates: GetCoordinates = useCallback((id: Media['id']) => {
    const exifObject = fullExifFilesList[id]

    return isGPSExist(exifObject)
      ? {
        GPSLatitude: exifObject.GPSLatitude,
        GPSLongitude: exifObject.GPSLongitude,
      }
      : undefined
  }, [fullExifFilesList])

  const getExif = useCallback(
    (id: Media['id']) => (e: MouseEvent) => {
      e.stopPropagation()
      setCurrentId(id)
      setShowModal(true)
    },
    [],
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
