import React, { useCallback, useEffect, useState } from 'react'
import type { ReactImageGalleryItem } from 'react-image-gallery'

import { isEmpty } from 'ramda'

import type { Media } from 'src/api/models/media'

import type { Player } from '../../UIKit/VideoPlayer/VideoJS'
import { GalleryMediaItem } from '../components'
import { GalleryMediaItemProps } from '../components/GalleryMediaItem/GalleryMediaItem'

interface UseImageGalleryDataProps {
  galleryArr: ReactImageGalleryItem[];
  stopPlayer: () => void
}

export const useImageGalleryData = (imageArr: Media[], isMainPage?: boolean): UseImageGalleryDataProps => {
  const [galleryArr, setGalleryArr] = useState<ReactImageGalleryItem[]>([])
  const playersRef = React.useRef<Record<number, Player | null>>({})

  const stopPlayer = useCallback(() => {
    if (isEmpty(playersRef.current)) return

    Object
      .keys(playersRef.current)
      .forEach(playerIdx => {
        const player = playersRef.current[playerIdx]
        player?.pause()
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
        showSkipButtons
        showPlaybackRates
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
