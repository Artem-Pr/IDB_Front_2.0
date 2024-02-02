import type { MutableRefObject } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'

import cn from 'classnames'

import { setPreviewPlaying, startVideoPreview } from '../../../../../redux/reducers/mainPageSlice/mainPageSlice'
import { imagePreview } from '../../../../../redux/selectors'
import { useAppDispatch } from '../../../../../redux/store/store'
import { isVideo } from '../../../../common/utils/utils'
import { GalleryMediaItem } from '../../../Gallery/components'

import styles from './PreviewMenu.module.scss'

export interface PreviewMenuProps {
  videoPreviewRef?: MutableRefObject<HTMLDivElement | null>
}
export const PreviewMenu = ({ videoPreviewRef }: PreviewMenuProps) => {
  const dispatch = useAppDispatch()
  const {
    previewType, originalPath, originalName, preview, playing, stop,
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
        originalPath={originalPath || ''}
        playing={playing}
        preview={preview}
        setPlaying={handleSetPlaying}
        setStop={handleStart}
        stop={stop}
        type={previewType}
        muted
        usePlaceholder
      />
      <h3>{originalName}</h3>
    </div>
  )
}
