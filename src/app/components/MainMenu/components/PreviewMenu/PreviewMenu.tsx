import type { MutableRefObject } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import cn from 'classnames'

import { isVideo } from 'src/app/common/utils'
import type { Player } from 'src/app/components/Gallery/components/GalleryMediaItem/VideoJS'
import { startVideoPreview } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { imagePreview } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { GalleryMediaItem } from '../../../Gallery/components'

import styles from './PreviewMenu.module.scss'

export interface PreviewMenuProps {
  videoPreviewRef?: MutableRefObject<HTMLDivElement | null>
}
export const PreviewMenu = ({ videoPreviewRef }: PreviewMenuProps) => {
  const dispatch = useAppDispatch()
  const {
    previewType, staticPath, originalName, staticPreview, staticVideoFullSize, playing, stop, exif, muted,
  } = useSelector(imagePreview)
  const playerRef = useRef<Player | null>(null)

  useEffect(() => {
    if (stop) {
      playerRef.current?.pause()
      dispatch(startVideoPreview())
    }
  }, [dispatch, stop])

  const handlePlayerReady = useCallback((player: Player) => {
    playerRef.current = player
  }, [])

  const isPlayingVideo = isVideo(previewType) && Boolean(playing)

  return (
    <div className={cn(styles.preview, { [styles.notPlayingVideo]: !isPlayingVideo })} ref={videoPreviewRef}>
      <GalleryMediaItem
        exif={exif}
        muted={muted}
        onReady={handlePlayerReady}
        staticPath={staticPath}
        staticPreview={staticPreview}
        staticVideoFullSize={staticVideoFullSize}
        type={previewType}
        usePlaceholder
      />
      <h3>{originalName}</h3>
    </div>
  )
}
