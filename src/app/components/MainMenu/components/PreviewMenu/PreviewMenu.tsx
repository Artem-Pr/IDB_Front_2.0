import type { MutableRefObject } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'

import cn from 'classnames'

import { isVideo } from 'src/app/common/utils'
import { setPreviewPlaying, startVideoPreview } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
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
    previewType, staticPath, originalName, staticPreview, staticVideoFullSize, playing, stop,
  } = useSelector(imagePreview)

  const handleSetPlaying = (value: boolean) => {
    dispatch(setPreviewPlaying(value))
  }

  const handleStart = () => {
    dispatch(startVideoPreview())
  }

  const isPlayingVideo = isVideo(previewType) && Boolean(playing)

  return (
    <div className={cn(styles.preview, { [styles.notPlayingVideo]: !isPlayingVideo })} ref={videoPreviewRef}>
      <GalleryMediaItem
        playing={playing}
        setPlaying={handleSetPlaying}
        setStop={handleStart}
        staticPath={staticPath}
        staticPreview={staticPreview}
        staticVideoFullSize={staticVideoFullSize}
        stop={stop}
        type={previewType}
        muted
        usePlaceholder
      />
      <h3>{originalName}</h3>
    </div>
  )
}
