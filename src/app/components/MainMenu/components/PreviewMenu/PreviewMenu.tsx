import type { MutableRefObject } from 'react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import cn from 'classnames'

import { isVideo } from 'src/app/common/utils'
import type { Player } from 'src/app/components/UIKit/VideoPlayer/VideoJS'
import { mainPageReducerStartVideoPreview } from 'src/redux/reducers/mainPageSlice'
import { getMainPageReducerImagePreview } from 'src/redux/reducers/mainPageSlice/selectors'
import { getSettingsReducerIsVideoPreviewMuted } from 'src/redux/reducers/settingsSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { GalleryMediaItem } from '../../../Gallery/components'

import styles from './PreviewMenu.module.scss'

export interface PreviewMenuProps {
  videoPreviewRef?: MutableRefObject<HTMLDivElement | null>
}
export const PreviewMenu = ({ videoPreviewRef }: PreviewMenuProps) => {
  const dispatch = useAppDispatch()
  const {
    previewType, staticPath, originalName, staticPreview, staticVideoFullSize, playing, stop, exif,
  } = useSelector(getMainPageReducerImagePreview)
  const muted = useSelector(getSettingsReducerIsVideoPreviewMuted)
  const playerRef = useRef<Player | null>(null)

  useEffect(() => {
    if (stop) {
      try {
        if (playerRef.current?.isDisposed()) return
        playerRef.current?.pause()
      } catch (error) {
        console.error('🚀 ~ PreviewMenu ~ error:', error)
      }
      dispatch(mainPageReducerStartVideoPreview())
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
