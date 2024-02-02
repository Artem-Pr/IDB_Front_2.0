import type { MutableRefObject } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'

import { Tooltip } from 'antd'
import cn from 'classnames'

import { previewDuplicates } from '../../../../../redux/selectors'
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
        originalPath, originalName, preview, filePath, fullSizeJpgPath,
      }) => (
        <div key={filePath} className={cn(styles.preview)} ref={videoPreviewRef}>
          <GalleryMediaItem
            originalPath={fullSizeJpgPath || originalPath || ''}
            preview={preview}
            ext={originalName.split('.')
              .at(-1)}
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
