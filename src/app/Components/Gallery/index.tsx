import React, { MouseEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { compose, keys, map } from 'ramda'
import { Modal, Spin } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import Iframe from 'react-iframe'
import ImageGallery from 'react-image-gallery'

import imagePlaceholder from '../../../assets/svg-icons-html/image-placeholder.svg'

import styles from './index.module.scss'
import { ExifFilesList, FieldsObj, IGallery } from '../../../redux/types'
import { setPreview } from '../../../redux/reducers/mainPageSlice-reducer'
import { isVideo } from '../../common/utils/utils'

interface VideoItemProps {
  originalPath: string
  preview: string
}

interface RawPreview {
  name: string
  type: string
  originalPath: string | undefined
}

export interface GalleryProps {
  openMenus: string[]
  imageArr: FieldsObj[]
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  removeFromSelectedList: (index: number) => void
  addToSelectedList: (index: number) => void
  clearSelectedList: () => void
  updateFiles: (tempPath: string) => void
  isLoading?: boolean
  isMainPage?: boolean
}

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  event.currentTarget.classList.remove('d-none')
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
  const dispatch = useDispatch()
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
  const isEditMode = isEditMenu || isTemplateMenu || isPropertiesMenu

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
            ...(isVideo(item.type) && {
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

  const handleImageClick = (i: number, preview?: RawPreview) => () => {
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

    isPropertiesMenu && !isEditMenu && !isTemplateMenu && selectOnlyOne()
    isEditMenu && selectOnlyOne()
    isTemplateMenu && selectAnyQuantity()
    preview &&
      dispatch(
        setPreview({
          video: isVideo(preview.type),
          originalName: preview.name,
          originalPath: preview.originalPath,
        })
      )
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

  const handleFullScreenClick = (i: number) => () => {
    setShowImageModal(true)
    setCurrentImage(i)
  }

  return (
    <Spin className={styles.spinner} spinning={isLoading} size="large">
      <div className={cn(styles.wrapper, 'd-grid')}>
        {imageArr.map(({ preview, name, tempPath, originalPath, type, _id }, i) => (
          <div
            key={preview + _id}
            className={cn(
              styles.item,
              {
                active: selectedList.includes(i),
                pointer: isEditMode,
              },
              'position-relative',
              'pointer'
            )}
            onClick={handleImageClick(i, { originalPath, name, type })}
          >
            <div
              className={cn(
                styles.itemMenu,
                `${isEditMode ? 'd-none' : 'd-flex'}`,
                'position-absolute',
                'h-100',
                'flex-column',
                'justify-content-between'
              )}
            >
              <h4 className={cn(styles.itemMenuExif, 'w-100', 'pointer')} onClick={getExif(tempPath)}>
                Exif
              </h4>
              <FullscreenOutlined className={cn(styles.itemMenuIcon, 'pointer')} onClick={handleFullScreenClick(i)} />
            </div>
            <img className={cn(styles.img, 'd-none')} src={preview} alt="image-preview" onLoad={handleImageOnLoad} />
            <img className={styles.imgPlaceholder} src={imagePlaceholder} alt="image placeholder" />
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
