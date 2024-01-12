import React, { SyntheticEvent, useState } from 'react'

import ReactPlayer from 'react-player/lazy'

import cn from 'classnames'

import { Spin } from 'antd'

import imagePlaceholder from '../../../../../assets/svg-icons-html/image-placeholder.svg'

import styles from './GalleryMediaItem.module.scss'
import { MimeTypes } from '../../../../../redux/types/MimeTypes'
import { isVideo } from '../../../../common/utils/utils'

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.remove('transparent')
}

const Loader = <Spin className={styles.loader} size="large" spinning={true} />

export interface Props {
  height?: string
  muted?: boolean
  originalPath: string
  playing?: boolean
  preview: string
  setPlaying?: (value: boolean) => void
  setStop?: (value: boolean) => void
  stop?: boolean
  type: MimeTypes
  usePlaceholder?: boolean
}

export const GalleryMediaItem = React.memo(
  ({
    height = '100%',
    muted,
    originalPath,
    playing,
    preview,
    setPlaying,
    setStop,
    stop,
    type,
    usePlaceholder,
  }: Props) => {
    const [showVideo, setShowVideo] = useState(false)

    const showPlaceholder = usePlaceholder && !originalPath && !preview
    const showVideoPlayer = showVideo && isVideo(type) && !stop
    const showVideoPreview = (!showVideo || stop) && isVideo(type)
    const showImage = !isVideo(type)

    const handleStart = () => {
      setShowVideo(true)
      setStop && setStop(false)
      setPlaying && setPlaying(true)
    }

    const handlePlay = () => {
      setPlaying && setPlaying(true)
    }

    const handlePause = () => {
      setPlaying && setPlaying(false)
    }

    return (
      <>
        {showVideoPlayer && (
          <div className={cn(styles.reactPlayerWrapper, 'h-100')}>
            <ReactPlayer
              height={height}
              muted={muted}
              onPause={handlePause}
              onPlay={handlePlay}
              playing={playing}
              style={{ position: 'absolute', top: 0, left: 0 }}
              url={originalPath}
              width="100%"
              controls
              loop
            />
          </div>
        )}
        {showVideoPreview && (
          <div className={cn(styles.videoPreviewWrapper, 'parent-size')}>
            <div className={styles.playButton} onClick={handleStart} />
            <img
              alt="video-preview"
              className={cn(styles.videoPreview, { [styles.placeholder]: showPlaceholder }, 'transparent parent-size')}
              onError={handleImageOnLoad}
              onLoad={handleImageOnLoad}
              src={preview}
            />
            {Loader}
          </div>
        )}
        {showImage && (
          <div className={cn({ [styles.placeholderWrapper]: showPlaceholder }, 'parent-size')}>
            <img
              alt="image-preview"
              className={cn(styles.img, { [styles.placeholder]: showPlaceholder }, 'transparent parent-size')}
              onError={handleImageOnLoad}
              onLoad={handleImageOnLoad}
              src={showPlaceholder ? imagePlaceholder : originalPath}
            />
            {Loader}
          </div>
        )}
      </>
    )
  }
)
