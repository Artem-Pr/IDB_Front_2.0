import React, { useCallback, useEffect, useState } from 'react'
import type { ReactImageGalleryItem } from 'react-image-gallery'

import type { Media } from 'src/api/models/media'

import { GalleryMediaItem } from '../components'
import { GalleryMediaItemProps } from '../components/GalleryMediaItem/GalleryMediaItem'
import type { Player } from '../components/GalleryMediaItem/VideoJS'

interface UseImageGalleryDataProps {
  galleryArr: ReactImageGalleryItem[];
  stopPlayer: () => void
}

export const useImageGalleryData = (imageArr: Media[], isMainPage?: boolean): UseImageGalleryDataProps => {
  const [galleryArr, setGalleryArr] = useState<ReactImageGalleryItem[]>([])
  const playersRef = React.useRef<Record<number, Player | null>>({})

  const stopPlayer = useCallback(() => {
    Object.values(playersRef.current)
      .forEach(player => {
        player?.played() && player?.pause()
      })
  }, [])

  useEffect(() => {
    const handlePlayerReady: GalleryMediaItemProps['onReady'] = (player, idx) => {
      if (idx != null) {
        playersRef.current[idx] = player
      }
    }

    const renderMediaItem = ({
      exif, staticPath, staticPreview, staticVideoFullSize, mimetype,
    }: Media, idx: number) => () => (
      <GalleryMediaItem
        idx={idx}
        exif={exif}
        onReady={handlePlayerReady}
        staticPath={staticPath}
        staticPreview={staticPreview}
        staticVideoFullSize={staticVideoFullSize}
        type={mimetype}
      />
    )

    isMainPage
      && setGalleryArr(
        imageArr.map((media, idx) => ({
          thumbnail: media.staticPreview,
          original: media.staticPath,
          renderItem: renderMediaItem(media, idx),
        })),
      )
  }, [imageArr, isMainPage])

  return {
    galleryArr,
    stopPlayer,
  }
}
