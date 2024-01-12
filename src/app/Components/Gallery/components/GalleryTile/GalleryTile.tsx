import React, { MouseEvent, SyntheticEvent, memo } from 'react'
import cn from 'classnames'

import { FullscreenOutlined } from '@ant-design/icons'

import styles from './GalleryTile.module.scss'
import imagePlaceholder from '../../../../../assets/svg-icons-html/image-placeholder.svg'
import { RawPreview } from '../../type'
import { MimeTypes } from '../../../../../redux/types/MimeTypes'

// eslint-disable-next-line functional/no-let
let timeout: NodeJS.Timeout

interface Props {
  fitContain: boolean
  fullSizeJpgPath: string
  getExif: (tempPath: string) => (e: MouseEvent) => void
  index: number
  isEditMode: boolean
  isShiftHover: boolean
  name: string
  onFullScreenClick: (index: number) => void
  onImageClick: (i: number, preview?: RawPreview) => void
  onImageOnLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void
  onImgRefAdd: (ref: HTMLDivElement | null, idx: number) => void
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
    fitContain,
    fullSizeJpgPath,
    getExif,
    index,
    isEditMode,
    isShiftHover,
    name,
    onFullScreenClick,
    onImageClick,
    onImageOnLoad,
    onImgRefAdd,
    onMouseEnter,
    originalPath,
    preview,
    previewSize,
    selectedList,
    tempPath,
    type,
  }: Props) => {
    const extensionTypeTouple = type.split('/')
    const extensionType = extensionTypeTouple[0]
    const extension = extensionTypeTouple[1]
    const isJPG = extension === 'jpeg' || extension === 'jpg'

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

    const handleImageClick = (event: MouseEvent) => {
      event.stopPropagation()
      onImageClick(index, { originalPath, name, type, preview, fullSizeJpgStatic: fullSizeJpgPath })
    }

    return (
      <div
        className={cn(
          styles.item,
          {
            active: selectedList.includes(index),
            pointer: isEditMode,
            [styles.shiftHover]: isShiftHover,
          },
          'position-relative',
          'pointer'
        )}
        onClick={handleImageClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={handleImgRefAdd}
        style={{ height: `${previewSize}px` }}
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
          <FullscreenOutlined
            className={cn(styles.itemMenuIcon, 'pointer d-flex justify-content-center')}
            onClick={handleFullScreenClick}
          />
        </div>
        {!isJPG && (
          <div className={cn(styles.extension, { [styles.video]: extensionType === 'video' }, 'position-absolute')}>
            {extension}
          </div>
        )}
        <img
          alt="image-preview"
          className={cn(styles.img, 'd-none')}
          onLoad={onImageOnLoad}
          src={preview}
          style={{ objectFit: `${fitContain ? 'contain' : 'cover'}` }}
        />
        <img className={styles.imgPlaceholder} src={imagePlaceholder} alt="image placeholder" />
      </div>
    )
  }
)
