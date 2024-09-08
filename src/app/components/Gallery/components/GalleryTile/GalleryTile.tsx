/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  MouseEvent, SyntheticEvent, memo, useMemo,
} from 'react'
import { useSelector } from 'react-redux'

import { EnvironmentOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import cn from 'classnames'
import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'
import imagePlaceholder from 'src/assets/svg-icons-html/image-placeholder3.svg'
import { checkForDuplicatesOnlyInCurrentFolder, duplicateFilesArr, session } from 'src/redux/selectors'

import { openGPSLocation, isGPSExist } from '../../helpers/getGPSCoordinates'

import styles from './GalleryTile.module.scss'

// eslint-disable-next-line init-declarations
let timeout: NodeJS.Timeout

export interface GalleryTileProps {
  fitContain: boolean
  index: number
  isEditMode: boolean
  isMainPage: boolean | undefined
  isShiftHover: boolean
  mediaFile: Media
  onFullScreenClick: (index: number) => void
  onImageClick: (i: number, preview?: Media) => void
  onImageOnLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void
  onImgRefAdd: (ref: HTMLDivElement | null, idx: number) => void
  onMouseEnter: (index: number | null) => void
  previewSize: number
  selectedList: number[]
  showExifList: (exif: Tags) => void
}

export const GalleryTile = memo(
  ({
    mediaFile,
    fitContain,
    index,
    isEditMode,
    isMainPage,
    isShiftHover,
    onFullScreenClick,
    onImageClick,
    onImageOnLoad,
    onImgRefAdd,
    onMouseEnter,
    previewSize,
    selectedList,
    showExifList,
  }: GalleryTileProps) => {
    const watchForDuplicatesOnlyInCurrentFolder = useSelector(checkForDuplicatesOnlyInCurrentFolder)
    const duplicatesForAllFiles = useSelector(duplicateFilesArr)
    const { isLoading } = useSelector(session)

    const extensionTypeTouple = mediaFile.mimetype.split('/')
    const extensionType = extensionTypeTouple[0]
    const extension = extensionTypeTouple[1]
    const isJPG = extension === 'jpeg' || extension === 'jpg'
    const isUploading = isLoading && !mediaFile.staticPreview

    const hasDuplicate = useMemo(() => (
      mediaFile.duplicates.length && watchForDuplicatesOnlyInCurrentFolder
        ? duplicatesForAllFiles
          .some(({ originalName }) => mediaFile.duplicates[0].originalName === originalName)
        : Boolean(mediaFile.duplicates.length)
    ), [duplicatesForAllFiles, mediaFile.duplicates, watchForDuplicatesOnlyInCurrentFolder])

    const handleMouseEnter = () => {
      clearTimeout(timeout)
      onMouseEnter(index)
    }
    const handleMouseLeave = () => {
      timeout = setTimeout(() => {
        onMouseEnter(null)
      }, 300)
    }

    const handleImgRefAdd = (ref: HTMLDivElement | null) => {
      onImgRefAdd(ref, index)
    }

    const handleFullScreenClick = (event: MouseEvent) => {
      event.stopPropagation()
      onFullScreenClick(index)
    }

    const handleLocationClick = (event: MouseEvent) => {
      event.stopPropagation()
      openGPSLocation(mediaFile.exif)
    }

    const handleImageClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      !isUploading && onImageClick(index, mediaFile)
    }

    const handleShowExifList = (event: MouseEvent): void => {
      event.stopPropagation()
      showExifList(mediaFile.exif)
    }

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={cn(
          styles.item,
          {
            [styles.loading]: isUploading,
            [styles.shiftHover]: isShiftHover,
            active: selectedList.includes(index),
            pointer: isEditMode,
          },
          'position-relative',
          'pointer',
        )}
        onClick={handleImageClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={handleImgRefAdd}
        style={{ height: `${previewSize}px` }}
      >
        <Tooltip title={hasDuplicate ? `Duplicate (${mediaFile.originalName})` : ''}>
          <div
            className={cn(
              styles.itemMenu,
              { [styles.highlighted]: hasDuplicate, [styles.isUploading]: isUploading },
              `${isEditMode ? 'd-none' : 'd-flex'}`,
              'position-absolute h-100 flex-column justify-content-between',
            )}
          >
            <h4 className={cn(styles.itemMenuExif, 'w-100', 'pointer')} onClick={handleShowExifList}>
              Exif
            </h4>
            {Boolean(isGPSExist(mediaFile.exif)) && (
              <EnvironmentOutlined
                className={cn(styles.itemMenuIcon, 'pointer d-flex justify-content-center mb-auto')}
                onClick={handleLocationClick}
              />
            )}
            {isMainPage && (
              <FullscreenOutlined
                className={cn(styles.itemMenuIcon, 'pointer d-flex justify-content-center')}
                onClick={handleFullScreenClick}
              />
            )}
          </div>
        </Tooltip>
        {!isJPG && (
          <div className={cn(styles.extension, { [styles.video]: extensionType === 'video' }, 'position-absolute')}>
            {extension}
          </div>
        )}
        {hasDuplicate && isEditMode && <div className={cn(styles.errorHighlight, 'position-absolute')} />}
        <img
          alt="preview"
          className={cn(styles.img, 'd-none')}
          onLoad={onImageOnLoad}
          src={mediaFile.staticPreview}
          style={{ objectFit: `${fitContain ? 'contain' : 'cover'}` }}
        />
        <img className={styles.imgPlaceholder} src={imagePlaceholder} alt="placeholder" />
      </div>
    )
  },
)
