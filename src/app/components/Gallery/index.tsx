import React, {
  Fragment, MutableRefObject, SyntheticEvent, useCallback, useState,
} from 'react'
import ImageGallery from 'react-image-gallery'
import { useDispatch, useSelector } from 'react-redux'

import { Modal, Spin, Switch } from 'antd'
import cn from 'classnames'

import type { Media } from 'src/api/models/media'

import { setPreviewPlaying } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { session } from '../../../redux/selectors'
import type { ExifFilesList } from '../../../redux/types'
import { MainMenuKeys } from '../../../redux/types'
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
  fullExifFilesList: ExifFilesList
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
  fullExifFilesList,
  selectedList,
  addToSelectedList,
  removeFromSelectedList,
  clearSelectedList,
  isLoading,
  isMainPage,
  refs: { gridRef, imgRef, imgFirstGroupNameRef },
}: GalleryProps) => {
  const dispatch = useDispatch()
  const { fitContain, previewSize } = useSelector(session)
  const { groupedByDate } = useSort()
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [showPreviewList, setShowPreviewList] = useState(true)
  const isEditMenu = openMenus.includes(MainMenuKeys.EDIT)
  const isTemplateMenu = openMenus.includes(MainMenuKeys.EDIT_BULK)
  const isPropertiesMenu = openMenus.includes(MainMenuKeys.PROPERTIES)
  const {
    exif,
    getExif,
    getGPSCoordinates,
    handleShowModalClose,
    isJSONMode,
    setIsJSONMode,
    showModal,
  } = useGetFullExifList({
    fullExifFilesList,
  })
  const {
    hoveredIndex, setHoveredIndex, isShiftPressed, isShiftHover, selectWithShift,
  } = useSelectWithShift({
    isTemplateMenu,
    selectedList,
    addToSelectedList,
    removeFromSelectedList,
  })
  const { galleryArr, playing, setPlaying } = useImageGalleryData(imageArr, isMainPage)

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
    setPlaying(false)
  }

  const handleImageModalClose = () => {
    const stopVideoAndCloseModal = () => {
      setPlaying(false)
      setTimeout(() => setShowImageModal(false), 100)
    }

    playing ? stopVideoAndCloseModal() : setShowImageModal(false)
  }

  const handleFullScreenClick = useCallback(
    (i: number) => {
      setShowImageModal(true)
      setCurrentImage(i)
      dispatch(setPreviewPlaying(false))
    },
    [dispatch],
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

  const handleLocationClick = (tempPath: string) => {
    const coordinates = getGPSCoordinates(tempPath)
    if (coordinates) {
      const { GPSLatitude, GPSLongitude } = coordinates
      window.open(`https://www.google.com/maps/search/${GPSLatitude}+${GPSLongitude}/@${GPSLatitude},${GPSLongitude},858m/data=!3m1!1e3!5m1!1e4?entry=ttu`, '_blank')
    }
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
                        getExif={getExif}
                        getGPSCoordinates={getGPSCoordinates}
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
                        onLocationClick={handleLocationClick}
                        onMouseEnter={setHoveredIndex}
                        previewSize={previewSize}
                        selectedList={selectedList}
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
                  getExif={getExif}
                  getGPSCoordinates={getGPSCoordinates}
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
                  onLocationClick={handleLocationClick}
                  onMouseEnter={setHoveredIndex}
                  previewSize={previewSize}
                  selectedList={selectedList}
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
        onCancel={handleShowModalClose}
        open={showModal}
        width="60%"
      >
        <pre className="overflow-y-scroll">{exif}</pre>
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
