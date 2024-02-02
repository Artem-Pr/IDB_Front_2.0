import React, { useEffect, useState } from 'react'

import { FieldsObj, IGallery } from '../../../../redux/types'
import { MimeTypes } from '../../../../redux/types/MimeTypes'
import { GalleryMediaItem } from '../components'

const getOriginalUrl = (file: FieldsObj) => file.fullSizeJpgPath || file.originalPath || ''
export const useImageGalleryData = (imageArr: FieldsObj[], isMainPage?: boolean) => {
  const [galleryArr, setGalleryArr] = useState<IGallery[]>([])
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const renderMediaItem = (originalPath: string, preview: string, type: MimeTypes) => () => (
      <GalleryMediaItem
        height="92%"
        originalPath={originalPath}
        playing={playing}
        preview={preview}
        setPlaying={setPlaying}
        type={type}
      />
    )

    isMainPage
      && setGalleryArr(
        imageArr.map(item => ({
          thumbnail: item.preview,
          original: getOriginalUrl(item),
          renderItem: renderMediaItem(getOriginalUrl(item), item.preview, item.type),
        })),
      )
  }, [imageArr, isMainPage, playing])

  return {
    galleryArr,
    playing,
    setPlaying,
  }
}
