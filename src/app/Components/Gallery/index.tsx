import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { compose, keys, map } from 'ramda'
import { Modal, Spin } from 'antd'
import Iframe from 'react-iframe'
import ImageGallery from 'react-image-gallery'

import styles from './index.module.scss'
import { ExifFilesList, ExtraDownloadingFields, IGallery, UploadingObject } from '../../../redux/types'

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
  const [showVideo, setShowVideo] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showFullscreenButton, setShowFullscreenButton] = useState(true)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [galleryArr, setGalleryArr] = useState<IGallery[]>([])
  const isEditMenu = useMemo(() => openMenus.includes('edit'), [openMenus])
  const isTemplateMenu = useMemo(() => openMenus.includes('template'), [openMenus])
  const exif = useMemo(() => fullExifFilesList[currentTempPath], [fullExifFilesList, currentTempPath])

  const handlePlay = () => {
    setShowVideo(true)
    setShowPlayButton(false)
    setShowFullscreenButton(false)
  }

  const videoItem = useCallback(
    (originalPath: string, preview: string) => {
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
    },
    [showVideo]
  )

  useEffect(() => {
    isMainPage &&
      setGalleryArr(
        imageArr.map(item => {
          const galleryItem: IGallery = {
            thumbnail: item.preview,
            original: item.originalPath || '',
            ...(item.type.startsWith('video') && {
              renderItem: () => videoItem(item.originalPath || '', item.preview),
            }),
          }
          return galleryItem
        })
      )
  }, [imageArr, isMainPage, showVideo, videoItem])

  const getExif = (e: MouseEvent, tempPath: string) => {
    e.stopPropagation()
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
    const showImageModal = () => {
      setShowImageModal(true)
      setCurrentImage(i)
    }

    isEditMenu && selectOnlyOne()
    isTemplateMenu && selectAnyQuantity()
    !isEditMenu && !isTemplateMenu && showImageModal()
  }

  const handleSlide = (currentIndex: number) => {
    setCurrentImage(currentIndex)
    setShowPlayButton(true)
    setShowFullscreenButton(true)
    setShowVideo(false)
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
                  onClick={e => getExif(e, tempPath)}
                >
                  Exif
                </h3>
              </div>
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

        {isMainPage ? (
          <Modal
            visible={showImageModal}
            wrapClassName="image-modal"
            closable={false}
            centered
            width="90%"
            footer={null}
            onCancel={() => setShowImageModal(false)}
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
