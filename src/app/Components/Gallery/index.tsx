import React, { MouseEvent, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { compose, keys, map } from 'ramda'
import { Modal, Spin } from 'antd'
import Iframe from 'react-iframe'
import ImageGallery from 'react-image-gallery'

import styles from './index.module.scss'
import { ExifFilesList, ExtraDownloadingFields, IGallery, UploadingObject } from '../../../redux/types'

interface VideoItemProps {
  originalPath: string
  preview: string
}

export interface GalleryProps {
  openMenus: string[]
  imageArr: Array<UploadingObject & ExtraDownloadingFields>
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  removeFromSelectedList: (index: number) => void
  addToSelectedList: (index: number) => void
  clearSelectedList: () => void
  updateFiles: (tempPath: string) => void
  isLoading?: boolean
  isMainPage?: boolean
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
  isLoading,
  isMainPage,
}: GalleryProps) => {
  const [currentTempPath, setCurrentTempPath] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showFullscreenButton, setShowFullscreenButton] = useState(true)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [galleryArr, setGalleryArr] = useState<IGallery[]>([])
  const isEditMenu = useMemo(() => openMenus.includes('edit'), [openMenus])
  const isTemplateMenu = useMemo(() => openMenus.includes('template'), [openMenus])
  const isPropertiesMenu = useMemo(() => openMenus.includes('properties'), [openMenus])
  const exif = useMemo(() => fullExifFilesList[currentTempPath], [fullExifFilesList, currentTempPath])

  const VideoItem = ({ originalPath, preview }: VideoItemProps) => {
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

  useEffect(() => {
    const showVideoItem = (originalPath: string, preview: string) => () =>
      <VideoItem originalPath={originalPath} preview={preview} />

    isMainPage &&
      setGalleryArr(
        imageArr.map(item => {
          const galleryItem: IGallery = {
            thumbnail: item.preview,
            original: item.originalPath || '',
            ...(item.type.startsWith('video') && {
              renderItem: showVideoItem(item.originalPath || '', item.preview),
            }),
          }
          return galleryItem
        })
      )
  }, [imageArr, isMainPage])

  const getExif = (tempPath: string) => (e: MouseEvent) => {
    e.stopPropagation()
    !fullExifFilesList[tempPath] && updateFiles(tempPath)
    setCurrentTempPath(tempPath)
    setShowModal(true)
  }

  const handleImageClick = (i: number) => () => {
    const updateFilesArr = () => {
      addToSelectedList(i)
    }
    const selectOnlyOne = () => {
      clearSelectedList()
      updateFilesArr()
    }
    const selectAnyQuantity = () => {
      selectedList.includes(i) ? removeFromSelectedList(i) : updateFilesArr()
    }
    const showImageModal = () => {
      setShowImageModal(true)
      setCurrentImage(i)
    }

    isPropertiesMenu && !isEditMenu && !isTemplateMenu && selectOnlyOne()
    isEditMenu && selectOnlyOne()
    isTemplateMenu && selectAnyQuantity()
    !(isEditMenu || isTemplateMenu || isPropertiesMenu) && showImageModal()
  }

  const handleSlide = (currentIndex: number) => {
    setCurrentImage(currentIndex)
    setShowPlayButton(true)
    setShowFullscreenButton(true)
  }

  const handleShowModalClose = () => {
    setShowModal(false)
  }

  const handleImageModalClose = () => {
    setShowImageModal(false)
  }

  return (
    <Spin className={styles.spinner} spinning={isLoading} size="large">
      <div className={cn(styles.wrapper, 'd-grid')}>
        {imageArr.map(({ preview, name, tempPath, _id }, i) => (
          <div
            key={preview + _id}
            className={cn(
              styles.item,
              {
                active: selectedList.includes(i),
                pointer: isEditMenu || isTemplateMenu || isPropertiesMenu,
              },
              'position-relative'
            )}
            onClick={handleImageClick(i)}
          >
            <div
              className={cn(
                styles.imgInfo,
                `${isEditMenu || isTemplateMenu || isPropertiesMenu ? 'd-none' : 'd-flex'} `,
                'position-absolute align-items-center flex-column'
              )}
            >
              <img className={cn(styles.img, styles.imgDesc)} src={preview} alt="image-preview" />
              <div className={cn(styles.imgInfoText, 'd-flex w-100')}>
                <h3 style={{ width: '70%' }} className={styles.imgName}>
                  {name}
                </h3>
                <h3
                  style={{ marginLeft: 'auto' }}
                  className={cn(styles.imgName, 'pointer')}
                  onClick={getExif(tempPath)}
                >
                  Exif
                </h3>
              </div>
            </div>
            <img className={styles.img} src={preview} alt="image-preview" />
          </div>
        ))}

        <Modal title="Exif list" footer={null} visible={showModal} onCancel={handleShowModalClose}>
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

        {isMainPage ? (
          <Modal
            visible={showImageModal}
            wrapClassName="image-modal"
            closable={false}
            centered
            width="90%"
            footer={null}
            onCancel={handleImageModalClose}
          >
            <ImageGallery
              items={galleryArr}
              slideDuration={0}
              slideInterval={3000}
              startIndex={currentImage}
              showThumbnails={false}
              onSlide={handleSlide}
              showPlayButton={showPlayButton}
              showFullscreenButton={showFullscreenButton}
              showIndex
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    </Spin>
  )
}

export default Gallery
