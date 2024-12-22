/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  SyntheticEvent, useCallback,
} from 'react'

import { Spin } from 'antd'
import cn from 'classnames'

import type { Media } from 'src/api/models/media'
import { isVideo, isVideoByExt } from 'src/app/common/utils'
import imagePlaceholder from 'src/assets/svg-icons-html/image-placeholder3.svg'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import type { Player } from './VideoJS'
import { VideoJS } from './VideoJS'

import styles from './GalleryMediaItem.module.scss'

const IPHONE_ROTATION_IDENTIFIER = Object.freeze({
  Make: 'Apple',
  CompressorName: 'HEVC',
  Rotation: 90,
})

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.remove('transparent')
}

const Loader = <Spin className={styles.loader} size="large" spinning />

export interface GalleryMediaItemProps {
  exif?: Media['exif']
  ext?: string
  idx?: number
  muted?: boolean
  onReady?: (player: Player, idx?: number) => void
  staticPath: string
  staticPreview: string
  staticVideoFullSize?: string | null
  type?: MimeTypes
  usePlaceholder?: boolean
}

export const GalleryMediaItem = React.memo(
  ({
    exif,
    ext,
    idx,
    muted,
    onReady,
    staticPath,
    staticPreview,
    staticVideoFullSize,
    type,
    usePlaceholder,
  }: GalleryMediaItemProps) => {
    const isVideoPreview = (type && isVideo(type)) || (ext && isVideoByExt(ext)) || false
    const showPlaceholder = usePlaceholder && !staticPath && !staticPreview
    const showImage = !isVideoPreview

    const handlePlayerReady = useCallback((player: Player) => {
      onReady && onReady(player, idx)
    }, [idx, onReady])

    const videoJsOptions = {
      autoplay: false,
      controls: true,
      fluid: true,
      poster: staticVideoFullSize,
      muted,
      responsive: true,
      sources: [{
        src: staticPath,
        type: 'video/mp4',
      }],
    }

    const needRotateIphoneVideo = exif?.CompressorName === IPHONE_ROTATION_IDENTIFIER.CompressorName
    && exif?.Make === IPHONE_ROTATION_IDENTIFIER.Make
    && exif?.Rotation === IPHONE_ROTATION_IDENTIFIER.Rotation

    return (
      <>
        {!showImage && (
          <div className={cn({ [styles.rotate180]: needRotateIphoneVideo }, styles.reactPlayerWrapper, 'h-100 d-flex')}>
            <VideoJS
              onReady={handlePlayerReady}
              options={videoJsOptions}
            />
          </div>
        )}
        {showImage && (
          <div className={cn({ [styles.placeholderWrapper]: showPlaceholder }, 'parent-size')}>
            <img
              alt="preview"
              className={cn(styles.img, { [styles.placeholder]: showPlaceholder }, 'transparent parent-size')}
              onError={handleImageOnLoad}
              onLoad={handleImageOnLoad}
              src={showPlaceholder ? imagePlaceholder : staticPath}
            />
            {Loader}
          </div>
        )}
      </>
    )
  },
)
