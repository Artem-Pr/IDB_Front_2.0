import React from 'react'
import cn from 'classnames'

import styles from './index.module.scss'
import { UploadingObject } from '../../../redux/types'

interface Props {
  imageArr: UploadingObject[]
}

const Gallery = ({ imageArr }: Props) => {
  return (
    <div className={cn(styles.wrapper, 'd-grid')}>
      {imageArr.map(({ preview }) => (
        <div key={preview} className={styles.item}>
          <img className={styles.img} src={preview} alt="image-preview" />
        </div>
      ))}
    </div>
  )
}

export default Gallery
