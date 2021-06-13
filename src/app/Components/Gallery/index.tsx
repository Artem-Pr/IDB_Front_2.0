import React, { useMemo, useState } from 'react'
import cn from 'classnames'
import { compose, keys, map } from 'ramda'
import { Modal } from 'antd'

import styles from './index.module.scss'
import { ExifFilesList, UploadingObject } from '../../../redux/types'

export interface GalleryProps {
  openMenus: string[]
  imageArr: UploadingObject[]
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  removeFromSelectedList: (index: number) => void
  addToSelectedList: (index: number) => void
  clearSelectedList: () => void
  updateFiles: (tempPath: string) => void
}

const Gallery = ({
  openMenus,
  imageArr,
  fullExifFilesList,
  selectedList,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
  updateFiles,
}: GalleryProps) => {
  const [currentTempPath, setCurrentTempPath] = useState('')
  const [showModal, setShowModal] = useState(false)
  const isEditMenu = useMemo(() => openMenus.includes('edit'), [openMenus])
  const isTemplateMenu = useMemo(() => openMenus.includes('template'), [openMenus])
  const exif = useMemo(() => fullExifFilesList[currentTempPath], [fullExifFilesList, currentTempPath])

  const getExif = (tempPath: string) => {
    !fullExifFilesList[tempPath] && updateFiles(tempPath)
    setCurrentTempPath(tempPath)
    setShowModal(true)
  }

  const handleImageClick = (i: number, tempPath: string) => {
    const updateFilesArr = () => {
      addToSelectedList(i)
      updateFiles(tempPath)
    }

    const selectOnlyOne = () => {
      clearSelectedList()
      updateFilesArr()
    }
    const selectAnyQuantity = () => {
      selectedList.includes(i) ? removeFromSelectedList(i) : updateFilesArr()
    }
    isEditMenu && selectOnlyOne()
    isTemplateMenu && selectAnyQuantity()
  }

  return (
    <div className={cn(styles.wrapper, 'd-grid')}>
      {imageArr.map(({ preview, name, tempPath }, i) => (
        <div
          key={preview}
          className={cn(
            styles.item,
            {
              active: selectedList.includes(i),
              pointer: isEditMenu || isTemplateMenu,
            },
            'position-relative'
          )}
          onClick={() => handleImageClick(i, tempPath)}
        >
          <div
            className={cn(
              styles.imgInfo,
              `${isEditMenu || isTemplateMenu ? 'd-none' : 'd-flex'} `,
              'position-absolute align-items-center'
            )}
          >
            <h3 style={{ width: '70%' }} className={styles.imgName}>
              {name}
            </h3>
            <h3
              style={{ marginLeft: 'auto' }}
              className={cn(styles.imgName, 'pointer')}
              onClick={() => getExif(tempPath)}
            >
              Exif
            </h3>
          </div>
          <img className={styles.img} src={preview} alt="image-preview" />
        </div>
      ))}
      <Modal title="Exif list" footer={null} visible={showModal} onCancel={() => setShowModal(false)}>
        {compose(
          map((item: string) => (
            <div key={item}>
              <span className="bold">{item + ':'}</span>
              <span style={{ marginLeft: 5 }}>{exif[item]}</span>
            </div>
          )),
          keys
        )(exif)}
      </Modal>
    </div>
  )
}

export default Gallery
