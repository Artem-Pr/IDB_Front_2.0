import React, { useEffect, useState } from 'react'
import type { ReactImageGalleryItem } from 'react-image-gallery'

import type { Media } from 'src/api/models/media'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import { GalleryMediaItem } from '../components'

interface UseImageGalleryDataProps {
  galleryArr: ReactImageGalleryItem[];
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useImageGalleryData = (imageArr: Media[], isMainPage?: boolean): UseImageGalleryDataProps => {
  const [galleryArr, setGalleryArr] = useState<ReactImageGalleryItem[]>([])
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const renderMediaItem = (
      staticPath: string,
      staticPreview: string,
      staticVideoFullSize: string | null,
      mimetype: MimeTypes,
    ) => () => (
      <GalleryMediaItem
        height="92%"
        playing={playing}
        setPlaying={setPlaying}
        staticPath={staticPath}
        staticPreview={staticPreview}
        staticVideoFullSize={staticVideoFullSize}
        type={mimetype}
      />
    )

    isMainPage
      && setGalleryArr(
        imageArr.map(({
          staticPath, staticPreview, staticVideoFullSize, mimetype,
        }) => ({
          thumbnail: staticPreview,
          original: staticPath,
          renderItem: renderMediaItem(staticPath, staticPreview, staticVideoFullSize, mimetype),
        })),
      )
  }, [imageArr, isMainPage, playing])

  return {
    galleryArr,
    playing,
    setPlaying,
  }
}
