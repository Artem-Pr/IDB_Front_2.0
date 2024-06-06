/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { SyntheticEvent, useState } from 'react'

import { Spin } from 'antd'
import cn from 'classnames'
import ReactPlayer from 'react-player/lazy'

import { isVideo, isVideoByExt } from 'src/app/common/utils'
import imagePlaceholder from 'src/assets/svg-icons-html/image-placeholder3.svg'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import styles from './GalleryMediaItem.module.scss'

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.remove('transparent')
}

const Loader = <Spin className={styles.loader} size="large" spinning />

export interface Props {
  ext?: string
  height?: string
  muted?: boolean
  playing?: boolean
  setPlaying?: (value: boolean) => void
  setStop?: (value: boolean) => void
  staticPath: string
  staticPreview: string
  stop?: boolean
  type?: MimeTypes
  usePlaceholder?: boolean
}

export const GalleryMediaItem = React.memo(
  ({
    ext,
    height = '100%',
    muted,
    staticPath,
    playing,
    staticPreview,
    setPlaying,
    setStop,
    stop,
    type,
    usePlaceholder,
  }: Props) => {
    const [showVideo, setShowVideo] = useState(false)

    const isVideoPreview = (type && isVideo(type)) || (ext && isVideoByExt(ext)) || false
    const showPlaceholder = usePlaceholder && !staticPath && !staticPreview
    const showVideoPlayer = showVideo && isVideoPreview && !stop
    const showVideoPreview = (!showVideo || stop) && isVideoPreview
    const showImage = !isVideoPreview

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
              url={staticPath}
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
              src={staticPreview}
            />
            {Loader}
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
