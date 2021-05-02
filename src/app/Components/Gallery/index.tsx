import React from 'react'
import cn from 'classnames'

import styles from './index.module.scss'
import { UploadingObject } from '../../../redux/types'

interface Props {
  openMenus: string[]
  imageArr: UploadingObject[]
  selectedList: number[]
  removeFromSelectedList: (index: number) => void
  addToSelectedList: (index: number) => void
  clearSelectedList: () => void
}

const Gallery = ({
  openMenus,
  imageArr,
  selectedList,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
}: Props) => {
  const handleImageClick = (i: number) => {
    const selectOnlyOne = () => {
      clearSelectedList()
      addToSelectedList(i)
    }
    const selectAnyQuantity = () => {
      selectedList.includes(i) ? removeFromSelectedList(i) : addToSelectedList(i)
    }
    openMenus.includes('edit') && selectOnlyOne()
    openMenus.includes('template') && selectAnyQuantity()
  }
  return (
    <div className={cn(styles.wrapper, 'd-grid')}>
      {imageArr.map(({ preview }, i) => (
        <div
          key={preview}
          className={cn(styles.item, { active: selectedList.includes(i) })}
          onClick={() => handleImageClick(i)}
        >
          <img className={styles.img} src={preview} alt="image-preview" />
        </div>
      ))}
    </div>
  )
}

export default Gallery
