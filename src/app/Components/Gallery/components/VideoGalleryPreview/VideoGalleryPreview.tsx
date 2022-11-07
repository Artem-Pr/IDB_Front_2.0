import React, { useState } from 'react'

import Iframe from 'react-iframe'

import styles from './VideoGalleryPreview.module.scss'

export interface Props {
  originalPath: string
  preview: string
  setShowPlayButton: (isShow: boolean) => void
  setShowFullscreenButton: (isShow: boolean) => void
}

export const VideoGalleryPreview = ({ originalPath, preview, setShowPlayButton, setShowFullscreenButton }: Props) => {
  const [showVideo, setShowVideo] = useState(false)

  const handlePlay = () => {
    setShowVideo(true)
    setShowPlayButton(false)
    setShowFullscreenButton(false)
  }

  return (
    <>
      {showVideo ? (
        <Iframe url={originalPath} width="80vm" id="myId" className={styles.iframeStyles} position="relative" />
      ) : (
        <div>
          <div className={styles.playButton} onClick={handlePlay} />
          <img src={preview} alt="video-preview" />
        </div>
      )}
    </>
  )
}
