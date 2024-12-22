import React, {
  Fragment, MutableRefObject, SyntheticEvent, useCallback, useState,
} from 'react'
import ImageGallery from 'react-image-gallery'
import { useSelector } from 'react-redux'

import { Modal, Spin, Switch } from 'antd'
import cn from 'classnames'

import type { Media } from 'src/api/models/media'
import { session } from 'src/redux/selectors'
import { MainMenuKeys } from 'src/redux/types'

import { useSort } from '../../common/hooks/useSort'

import { GalleryTile, ImageGalleryMenu } from './components'
import {
  useImageArrayGroupedByDate, useImageClick, useImageGalleryData, useSelectWithShift,
} from './hooks'
import { useGetFullExifList } from './hooks/useGefFullExifList'

import styles from './index.module.scss'

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.remove('d-none')
}

export interface GalleryProps {
  openMenus: string[]
  imageArr: Media[]
  selectedList: number[]
  removeFromSelectedList: (index: number[]) => void
  addToSelectedList: (indexArr: number[]) => void
  clearSelectedList: () => void
  isLoading?: boolean
  isMainPage?: boolean
  refs: {
    gridRef: MutableRefObject<(HTMLDivElement | null)[]>
    imgRef: MutableRefObject<(HTMLDivElement | null)[]>
    imgFirstGroupNameRef: MutableRefObject<HTMLDivElement | null>
  }
}

const Gallery = ({
  openMenus,
  imageArr,
  selectedList,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
  isLoading,
  isMainPage,
  refs: { gridRef, imgRef, imgFirstGroupNameRef },
}: GalleryProps) => {
  const { fitContain, previewSize } = useSelector(session)
  const { groupedByDate } = useSort()
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [showPreviewList, setShowPreviewList] = useState(true)
  const isEditMenu = openMenus.includes(MainMenuKeys.EDIT)
  const isTemplateMenu = openMenus.includes(MainMenuKeys.EDIT_BULK)
  const isPropertiesMenu = openMenus.includes(MainMenuKeys.PROPERTIES)
  const {
    handleCloseExifModal,
    isJSONMode,
    renderedExif,
    setIsJSONMode,
    showExifList,
    showExifModal,
  } = useGetFullExifList()
  const {
    hoveredIndex, setHoveredIndex, isShiftPressed, isShiftHover, selectWithShift,
  } = useSelectWithShift({
    isTemplateMenu,
    selectedList,
    addToSelectedList,
    removeFromSelectedList,
  })
  const { galleryArr, stopPlayer } = useImageGalleryData(imageArr, isMainPage)

  const { imageArrayGroupedByDate } = useImageArrayGroupedByDate(imageArr)

  const isEditMode = isEditMenu || isTemplateMenu || isPropertiesMenu

  const { handleImageClick } = useImageClick({
    selectedList,
    isShiftPressed,
    isEditMenu,
    isPropertiesMenu,
    isTemplateMenu,
    hoveredIndex,
    selectWithShift,
    removeFromSelectedList,
    addToSelectedList,
    clearSelectedList,
  })

  const imageGalleryMenu = useCallback(
    (onFullScreenClick: React.MouseEventHandler<HTMLElement>, isFullscreen: boolean) => (
      <ImageGalleryMenu
        onFullScreenClick={onFullScreenClick}
        onShowPreviewClick={() => setShowPreviewList(prev => !prev)}
        isFullscreen={isFullscreen}
        showPreview={showPreviewList}
      />
    ),
    [showPreviewList],
  )

  const handleSlide = (currentIndex: number) => {
    setCurrentImage(currentIndex)
    stopPlayer()
  }

  const handleImageModalClose = () => {
    stopPlayer()
    setTimeout(() => setShowImageModal(false), 100)
  }

  const handleFullScreenClick = useCallback(
    (i: number) => {
      setShowImageModal(true)
      setCurrentImage(i)
    },
    [],
  )

  const handleImgRefAdd = useCallback(
    (ref: HTMLDivElement | null, imgIdx: number) => {
      imgRef.current[imgIdx] = ref
    },
    [imgRef],
  )

  const handleGridRefAdd = (ref: HTMLDivElement | null, dateGroupIdx: number) => {
    gridRef.current[dateGroupIdx] = ref
  }

  const handleImgFirstGroupNameAdd = (ref: HTMLDivElement | null, imageGroupIdx: number) => {
    imageGroupIdx === 0 && (imgFirstGroupNameRef.current = ref)
  }

  const handleJSONModeChange = (checked: boolean) => {
    setIsJSONMode(checked)
  }

  return (
    <Spin className={styles.spinner} spinning={isLoading} size="large">
      {groupedByDate
        ? (
          Object.keys(imageArrayGroupedByDate)
            .map((date, dateGroupIdx) => (
              <Fragment key={date}>
                <h2 ref={ref => handleImgFirstGroupNameAdd(ref, dateGroupIdx)} className="margin-left-10">
                  {date}
                </h2>
                <div
                  className={cn(styles.wrapper, 'd-grid grid-wrapper')}
                  ref={ref => handleGridRefAdd(ref, dateGroupIdx)}
                  style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${previewSize}px, 1fr))` }}
                >
                  {imageArrayGroupedByDate[date].map(
                    mediaFileWithIndex => (
                      <GalleryTile
                        fitContain={fitContain}
                        // TODO: need to check index, probably I can use another index to fix problem with multiple select
                        index={mediaFileWithIndex.index}
                        isEditMode={isEditMode}
                        isMainPage={isMainPage}
                        // TODO: probably better to move index inside component, because we have index in mediaFile
                        isShiftHover={isShiftHover(mediaFileWithIndex.index)}
                        key={mediaFileWithIndex.id}
                        mediaFile={mediaFileWithIndex}
                        onFullScreenClick={handleFullScreenClick}
                        onImageClick={handleImageClick}
                        onImageOnLoad={handleImageOnLoad}
                        onImgRefAdd={handleImgRefAdd}
                        onMouseEnter={setHoveredIndex}
                        previewSize={previewSize}
                        selectedList={selectedList}
                        showExifList={showExifList}
                      />
                    ),
                  )}
                </div>
              </Fragment>
            ))
        )
        : (
          <div
            className={cn(styles.wrapper, 'd-grid')}
            ref={ref => handleGridRefAdd(ref, 0)}
            style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${previewSize}px, 1fr))` }}
          >
            {imageArr.map(
              (mediaFile, idx) => (
                <GalleryTile
                  fitContain={fitContain}
                  index={idx}
                  isEditMode={isEditMode}
                  isMainPage={isMainPage}
                  isShiftHover={isShiftHover(idx)}
                  key={mediaFile.id}
                  mediaFile={mediaFile}
                  onFullScreenClick={handleFullScreenClick}
                  onImageClick={handleImageClick}
                  onImageOnLoad={handleImageOnLoad}
                  onImgRefAdd={handleImgRefAdd}
                  onMouseEnter={setHoveredIndex}
                  previewSize={previewSize}
                  selectedList={selectedList}
                  showExifList={showExifList}
                />
              ),
            )}
          </div>
        )}

      <Modal
        title={(
          <>
            <span>Exif list</span>
            <span style={{ marginLeft: 30 }}>JSON mode</span>
            <Switch className="margin-left-10" onChange={handleJSONModeChange} checked={isJSONMode} />
          </>
        )}
        footer={null}
        onCancel={handleCloseExifModal}
        open={showExifModal}
        width="60%"
      >
        <pre className="overflow-y-scroll">{renderedExif}</pre>
      </Modal>

      {isMainPage && galleryArr.length
        ? (
          <Modal
            centered
            closable={false}
            footer={null}
            onCancel={handleImageModalClose}
            open={showImageModal}
            width="90%"
            wrapClassName="image-modal"
          >
            <ImageGallery
              additionalClass={styles.imageGallery}
              infinite={false}
              items={galleryArr}
              onSlide={handleSlide}
              renderFullscreenButton={imageGalleryMenu}
              showFullscreenButton
              showThumbnails={showPreviewList}
              slideDuration={0}
              slideInterval={3000}
              startIndex={currentImage}
              lazyLoad
              showIndex
              useTranslate3D
            />
          </Modal>
        )
        : (
          ''
        )}
    </Spin>
  )
}

export default Gallery
