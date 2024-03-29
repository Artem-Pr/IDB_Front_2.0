/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  MouseEvent, SyntheticEvent, memo, useMemo,
} from 'react'
import { useSelector } from 'react-redux'

import { EnvironmentOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import cn from 'classnames'

import imagePlaceholder from '../../../../../assets/svg-icons-html/image-placeholder.svg'
import { checkForDuplicatesOnlyInCurrentFolder, duplicateFilesArr, session } from '../../../../../redux/selectors'
import type { ExistedFile } from '../../../../../redux/types'
import { MimeTypes } from '../../../../../redux/types/MimeTypes'
import { GetCoordinates } from '../../hooks/useGefFullExifList/useGetFullExifList'
import type { RawPreview } from '../../type'

import styles from './GalleryTile.module.scss'

// eslint-disable-next-line init-declarations
let timeout: NodeJS.Timeout

interface Props {
  existedFilesArr: ExistedFile[] | undefined
  fitContain: boolean
  fullSizeJpgPath: string
  getGPSCoordinates: GetCoordinates
  getExif: (tempPath: string) => (e: MouseEvent) => void
  index: number
  isEditMode: boolean
  isMainPage: boolean | undefined
  isShiftHover: boolean
  name: string
  onFullScreenClick: (index: number) => void
  onImageClick: (i: number, preview?: RawPreview) => void
  onImageOnLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void
  onImgRefAdd: (ref: HTMLDivElement | null, idx: number) => void
  onLocationClick: (tempPath: string) => void
  onMouseEnter: (index: number | null) => void
  originalPath: string | undefined
  preview: string
  previewSize: number
  selectedList: number[]
  tempPath: string
  type: MimeTypes
}

export const GalleryTile = memo(
  ({
    existedFilesArr,
    fitContain,
    fullSizeJpgPath,
    getGPSCoordinates,
    getExif,
    index,
    isEditMode,
    isMainPage,
    isShiftHover,
    name,
    onFullScreenClick,
    onImageClick,
    onImageOnLoad,
    onImgRefAdd,
    onLocationClick,
    onMouseEnter,
    originalPath,
    preview,
    previewSize,
    selectedList,
    tempPath,
    type,
  }: Props) => {
    const watchForDuplicatesOnlyInCurrentFolder = useSelector(checkForDuplicatesOnlyInCurrentFolder)
    const duplicates = useSelector(duplicateFilesArr)
    const { isLoading } = useSelector(session)

    const extensionTypeTouple = type.split('/')
    const extensionType = extensionTypeTouple[0]
    const extension = extensionTypeTouple[1]
    const isJPG = extension === 'jpeg' || extension === 'jpg'
    const isUploading = isLoading && !preview

    const hasDuplicate = useMemo(() => (existedFilesArr?.length && watchForDuplicatesOnlyInCurrentFolder
      ? duplicates.some(({ originalName }) => existedFilesArr[0].originalName === originalName)
      : Boolean(existedFilesArr?.length)), [duplicates, existedFilesArr, watchForDuplicatesOnlyInCurrentFolder])

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
      onLocationClick(tempPath)
    }

    const handleImageClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      !isUploading && onImageClick(index, {
        originalPath, name, type, preview, fullSizeJpgStatic: fullSizeJpgPath,
      })
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
        <Tooltip title={hasDuplicate ? `Duplicate (${name})` : ''}>
          <div
            className={cn(
              styles.itemMenu,
              { [styles.highlighted]: hasDuplicate, [styles.isUploading]: isUploading },
              `${isEditMode ? 'd-none' : 'd-flex'}`,
              'position-absolute h-100 flex-column justify-content-between',
            )}
          >
            <h4 className={cn(styles.itemMenuExif, 'w-100', 'pointer')} onClick={getExif(tempPath)}>
              Exif
            </h4>
            {Boolean(getGPSCoordinates(tempPath)) && (
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
          src={preview}
          style={{ objectFit: `${fitContain ? 'contain' : 'cover'}` }}
        />
        <img className={styles.imgPlaceholder} src={imagePlaceholder} alt="placeholder" />
      </div>
    )
  },
)
