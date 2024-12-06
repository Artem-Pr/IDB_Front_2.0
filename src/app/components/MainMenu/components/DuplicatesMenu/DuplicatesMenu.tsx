import type { MutableRefObject } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'

import { Tooltip } from 'antd'
import cn from 'classnames'

import { previewDuplicates } from 'src/redux/selectors'

import { GalleryMediaItem } from '../../../Gallery/components'

import styles from './DuplicatesMenu.module.scss'

export interface PreviewMenuProps {
  videoPreviewRef?: MutableRefObject<HTMLDivElement | null>
}
export const DuplicatesMenu = ({ videoPreviewRef }: PreviewMenuProps) => {
  const previewDuplicatesArr = useSelector(previewDuplicates)

  return (
    <div>
      {previewDuplicatesArr.map(({
        filePath, staticPath, mimetype, staticPreview, staticVideoFullSize,
      }) => (
        <div key={filePath} className={cn(styles.preview)} ref={videoPreviewRef}>
          <GalleryMediaItem
            staticPath={staticPath}
            staticPreview={staticPreview}
            staticVideoFullSize={staticVideoFullSize}
            type={mimetype}
            muted
            usePlaceholder
          />
          <Tooltip title={filePath}>
            <h3 className={styles.fileName}>{filePath}</h3>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}
