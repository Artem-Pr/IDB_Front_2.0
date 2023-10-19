import React, { MutableRefObject, RefObject, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { Modal, Spin, Switch } from 'antd'
import ImageGallery from 'react-image-gallery'

import styles from './index.module.scss'
import type { ExifFilesList, FieldsObj } from '../../../redux/types'
import { setPreview } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { getLastItem, isVideo } from '../../common/utils/utils'
import { session, uploadingBlobs } from '../../../redux/selectors'
import type { RawPreview } from './type'
import { GalleryTile } from './components'
import { useImageGalleryData, useSelectWithShift } from './hooks'
import { MainMenuKeys } from '../../../redux/types'
import { useGetFullExifList } from './hooks/useGefFullExifList'

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.classList.remove('d-none')
}

export interface GalleryProps {
  openMenus: string[]
  imageArr: FieldsObj[]
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  removeFromSelectedList: (index: number[]) => void
  addToSelectedList: (indexArr: number[]) => void
  clearSelectedList: () => void
  updateFiles: (tempPath: string) => void
  isLoading?: boolean
  isMainPage?: boolean
  gridRef: MutableRefObject<HTMLDivElement | null>
  imgRef: RefObject<(HTMLDivElement | null)[]>
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
  gridRef,
  imgRef,
}: GalleryProps) => {
  const dispatch = useDispatch()
  const blobFiles = useSelector(uploadingBlobs)
  const { fitContain, previewSize } = useSelector(session)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const isEditMenu = useMemo(() => openMenus.includes(MainMenuKeys.EDIT), [openMenus])
  const isTemplateMenu = useMemo(() => openMenus.includes(MainMenuKeys.EDIT_BULK), [openMenus])
  const isPropertiesMenu = useMemo(() => openMenus.includes(MainMenuKeys.PROPERTIES), [openMenus])
  const { getExif, showModal, handleShowModalClose, exif, setIsJSONMode, isJSONMode } = useGetFullExifList({
    fullExifFilesList,
    updateFiles,
  })
  const { hoveredIndex, setHoveredIndex, isShiftPressed, isShiftHover, selectWithShift } = useSelectWithShift({
    isTemplateMenu,
    selectedList,
    addToSelectedList,
    removeFromSelectedList,
  })
  const { galleryArr, setShowPlayButton, showPlayButton, showFullscreenButton, setShowFullscreenButton } =
    useImageGalleryData(imageArr, isMainPage)

  const isEditMode = isEditMenu || isTemplateMenu || isPropertiesMenu

  useEffect(() => {
    // !isLoading && gridRef.current?.scrollIntoView()
  }, [gridRef, isLoading])

  const handleImageClick = useCallback(
    (i: number, preview?: RawPreview) => () => {
      const updateFilesArr = () => {
        addToSelectedList([i])
      }
      const selectOnlyOne = () => {
        clearSelectedList()
        updateFilesArr()
      }
      const selectAnyQuantity = () => {
        selectedList.includes(i) ? removeFromSelectedList([i]) : updateFilesArr()
      }

      const lastSelectedElemIndex = getLastItem(selectedList)

      isShiftPressed && !isEditMenu && (lastSelectedElemIndex || hoveredIndex) && selectWithShift(lastSelectedElemIndex)
      !isShiftPressed && isPropertiesMenu && !isEditMenu && !isTemplateMenu && selectOnlyOne()
      !isShiftPressed && isEditMenu && selectOnlyOne()
      !isShiftPressed && isTemplateMenu && selectAnyQuantity()
      preview &&
        dispatch(
          setPreview({
            previewType: isVideo(preview.type) ? 'video' : 'image',
            originalName: preview.name,
            originalPath: preview.fullSizeJpgStatic || preview.originalPath || blobFiles[preview.name],
          })
        )
    },
    [
      addToSelectedList,
      blobFiles,
      clearSelectedList,
      dispatch,
      hoveredIndex,
      isEditMenu,
      isPropertiesMenu,
      isShiftPressed,
      isTemplateMenu,
      removeFromSelectedList,
      selectWithShift,
      selectedList,
    ]
  )

  const handleSlide = (currentIndex: number) => {
    setCurrentImage(currentIndex)
    setShowPlayButton(true)
    setShowFullscreenButton(true)
  }

  const handleImageModalClose = () => {
    setShowImageModal(false)
  }

  const handleFullScreenClick = useCallback(
    (i: number) => () => {
      setShowImageModal(true)
      setCurrentImage(i)
    },
    []
  )

  const handleImgRefAdd = useCallback(
    (ref: HTMLDivElement | null) => {
      // eslint-disable-next-line functional/immutable-data
      imgRef.current?.push(ref)
    },
    [imgRef]
  )

  const handleJSONModeChange = (checked: boolean) => {
    setIsJSONMode(checked)
  }

  return (
    <Spin className={styles.spinner} spinning={isLoading} size="large">
      <div
        ref={gridRef}
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${previewSize}px, 1fr))` }}
        className={cn(styles.wrapper, 'd-grid')}
      >
        {imageArr.map(({ fullSizeJpgPath, preview, name, tempPath, originalPath, type, _id }, i) => (
          <GalleryTile
            key={preview + _id}
            index={i}
            isShiftHover={isShiftHover(i)}
            preview={preview}
            name={name}
            tempPath={tempPath}
            originalPath={originalPath}
            fullSizeJpgPath={fullSizeJpgPath}
            type={type}
            previewSize={previewSize}
            selectedList={selectedList}
            isEditMode={isEditMode}
            fitContain={fitContain}
            handleImgRefAdd={handleImgRefAdd}
            handleImageClick={handleImageClick}
            getExif={getExif}
            handleFullScreenClick={handleFullScreenClick}
            handleImageOnLoad={handleImageOnLoad}
            onMouseEnter={setHoveredIndex}
          />
        ))}

        <Modal
          title={
            <>
              <span>Exif list</span>
              <span style={{ marginLeft: 30 }}>JSON mode</span>
              <Switch className="margin-left-10" onChange={handleJSONModeChange} checked={isJSONMode} />
            </>
          }
          width={'60%'}
          footer={null}
          open={showModal}
          onCancel={handleShowModalClose}
        >
          <pre className="overflow-y-scroll">{exif}</pre>
        </Modal>

        {isMainPage ? (
          <Modal
            open={showImageModal}
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
