import React from 'react'

import cn from 'classnames'

import styles from './ImageGalleryMenu.module.scss'

const closeFullScreenIcon = 'M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3'
const openFullScreenIcon = 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3'

interface Props {
  onFullScreenClick: React.MouseEventHandler<HTMLElement>
  onShowPreviewClick: React.MouseEventHandler<HTMLElement>
  isFullscreen: boolean
  showPreview: boolean
}
export const ImageGalleryMenu = ({
  onFullScreenClick, onShowPreviewClick, isFullscreen, showPreview,
}: Props) => (
  <>
    <button
      onClick={onShowPreviewClick}
      type="button"
      className={cn(styles.showPreviewButton, { [styles.hidePreview]: !showPreview }, 'image-gallery-icon show-preview-button')}
      aria-label="Next Slide"
    >
      <svg
        className="image-gallery-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="6 0 12 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
    <button
      onClick={onFullScreenClick}
      type="button"
      className={cn(styles.fullScreenButton, 'image-gallery-icon image-gallery-fullscreen-button')}
      aria-label="Open Fullscreen"
    >
      <svg
        className="image-gallery-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={isFullscreen ? closeFullScreenIcon : openFullScreenIcon} />
      </svg>
    </button>
  </>
)
