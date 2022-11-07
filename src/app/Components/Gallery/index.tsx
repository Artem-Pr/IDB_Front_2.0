import React, {
  MouseEvent,
  MutableRefObject,
  RefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { compose, keys, map } from 'ramda'
import { Modal, Spin } from 'antd'
import ImageGallery from 'react-image-gallery'

import styles from './index.module.scss'
import { ExifFilesList, FieldsObj, IGallery } from '../../../redux/types'
import { setPreview } from '../../../redux/reducers/mainPageSlice-reducer'
import { isVideo } from '../../common/utils/utils'
import { session, uploadingBlobs } from '../../../redux/selectors'
import { RawPreview } from './type'
import { GalleryTile, VideoGalleryPreview } from './components'

const handleImageOnLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
  event.currentTarget.classList.remove('d-none')
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

  useEffect(() => {
    const showVideoItem = (originalPath: string, preview: string) => () =>
      (
        <VideoGalleryPreview
          originalPath={originalPath}
          preview={preview}
          setShowFullscreenButton={setShowFullscreenButton}
          setShowPlayButton={setShowPlayButton}
        />
      )

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

  const getExif = useCallback(
    (tempPath: string) => (e: MouseEvent) => {
      e.stopPropagation()
      !fullExifFilesList[tempPath] && updateFiles(tempPath)
      setCurrentTempPath(tempPath)
      setShowModal(true)
    },
    [fullExifFilesList, updateFiles]
  )

  const handleImageClick = useCallback(
    (i: number, preview?: RawPreview) => () => {
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
            previewType: isVideo(preview.type) ? 'video' : 'image',
            originalName: preview.name,
            originalPath: isMainPage ? preview.originalPath : blobFiles[preview.name],
          })
        )
    },
    [
      addToSelectedList,
      blobFiles,
      clearSelectedList,
      dispatch,
      isEditMenu,
      isMainPage,
      isPropertiesMenu,
      isTemplateMenu,
      removeFromSelectedList,
      selectedList,
    ]
  )

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

  return (
    <Spin className={styles.spinner} spinning={isLoading} size="large">
      <div
        ref={gridRef}
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${previewSize}px, 1fr))` }}
        className={cn(styles.wrapper, 'd-grid')}
      >
        {imageArr.map(({ preview, name, tempPath, originalPath, type, _id }, i) => (
          <GalleryTile
            key={preview + _id}
            index={i}
            preview={preview}
            name={name}
            tempPath={tempPath}
            originalPath={originalPath}
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
          />
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
