import React, { useEffect, useState } from 'react'

import { VideoGalleryPreview } from '../components'
import { FieldsObj, IGallery } from '../../../../redux/types'
import { isVideo } from '../../../common/utils/utils'

export const useImageGalleryData = (imageArr: FieldsObj[], isMainPage?: boolean) => {
  const [galleryArr, setGalleryArr] = useState<IGallery[]>([])
  const [showFullscreenButton, setShowFullscreenButton] = useState(true)
  const [showPlayButton, setShowPlayButton] = useState(true)

  useEffect(() => {
    const showVideoItem = (originalPath: string, preview: string) => () =>
      (
        <VideoGalleryPreview
          originalPath={originalPath}
          preview={preview}
          setShowFullscreenButton={setShowFullscreenButton}
          setShowPlayButton={setShowPlayButton}
        />
      )

    isMainPage &&
      setGalleryArr(
        imageArr.map(item => {
          const galleryItem: IGallery = {
            thumbnail: item.preview,
            original: item.fullSizeJpgPath || item.originalPath || '',
            ...(isVideo(item.type) && {
              renderItem: showVideoItem(item.originalPath || '', item.preview),
            }),
          }
          return galleryItem
        })
      )
  }, [imageArr, isMainPage])

  return {
    showFullscreenButton,
    setShowFullscreenButton,
    showPlayButton,
    setShowPlayButton,
    galleryArr,
  }
}
