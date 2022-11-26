import React from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import Iframe from 'react-iframe'

import { imagePreview } from '../../../../../redux/selectors'

import styles from './PreviewMenu.module.scss'

export const PreviewMenu = () => {
  const { previewType, originalPath, originalName } = useSelector(imagePreview)

  return (
    <div className={cn(styles.preview)}>
      {previewType === 'video' ? (
        <Iframe
          url={originalPath || ''}
          width="80vm"
          id="myId"
          className={styles.previewImg}
          position="relative"
          allowFullScreen
        />
      ) : (
        <img className={styles.previewImg} src={originalPath} alt={originalName} />
      )}
      <h3>{originalName}</h3>
    </div>
  )
}
