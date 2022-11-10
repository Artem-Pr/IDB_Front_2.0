import React, { MouseEvent, SyntheticEvent } from 'react'
import cn from 'classnames'

import { FullscreenOutlined } from '@ant-design/icons'

import styles from './GalleryTile.module.scss'
import imagePlaceholder from '../../../../../assets/svg-icons-html/image-placeholder.svg'
import { RawPreview } from '../../type'

// eslint-disable-next-line functional/no-let
let timeout: NodeJS.Timeout

interface Props {
  index: number
  isShiftHover: boolean
  preview: string
  name: string
  tempPath: string
  originalPath: string | undefined
  type: string
  previewSize: number
  selectedList: number[]
  isEditMode: boolean
  fitContain: boolean
  handleImgRefAdd: (ref: HTMLDivElement | null) => void
  handleImageClick: (i: number, preview?: RawPreview) => () => void
  getExif: (tempPath: string) => (e: MouseEvent) => void
  handleFullScreenClick: (index: number) => () => void
  handleImageOnLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void
  onMouseEnter: (index: number | null) => void
}

export const GalleryTile = ({
  index,
  isShiftHover,
  preview,
  name,
  tempPath,
  originalPath,
  type,
  previewSize,
  selectedList,
  isEditMode,
  fitContain,
  handleImgRefAdd,
  handleImageClick,
  getExif,
  handleFullScreenClick,
  handleImageOnLoad,
  onMouseEnter,
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

  return (
    <div
      ref={handleImgRefAdd}
      style={{ height: `${previewSize}px` }}
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
      onClick={handleImageClick(index, { originalPath, name, type })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        <FullscreenOutlined className={cn(styles.itemMenuIcon, 'pointer')} onClick={handleFullScreenClick(index)} />
      </div>
      {!isJPG && (
        <div className={cn(styles.extension, { [styles.video]: extensionType === 'video' }, 'position-absolute')}>
          {extension}
        </div>
      )}
      <img
        style={{ objectFit: `${fitContain ? 'contain' : 'cover'}` }}
        className={cn(styles.img, 'd-none')}
        src={preview}
        alt="image-preview"
        onLoad={handleImageOnLoad}
      />
      <img className={styles.imgPlaceholder} src={imagePlaceholder} alt="image placeholder" />
    </div>
  )
}
