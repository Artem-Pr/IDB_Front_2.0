import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'ramda'

import { useLocation } from 'react-router-dom'

import { CustomAlert, Gallery, GalleryTopMenu, MainMenu } from '../../Components'
import { dPageGalleryPropsSelector } from '../../../redux/selectors'
import { useMenuResize, usePreviewResize } from '../../common/hooks'
import PaginationMenu from '../../Components/PaginationMenu'
import { ResizeDivider } from '../../Components/ResizeDivider'

import { useGalleryProps, useMainMenuProps } from './hooks'
import { MainMenuKeys } from '../../../redux/types'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'

const { Content } = Layout

const MainPage = () => {
  const { menuRef, handleDividerMove, handleFinishResize } = useMenuResize()
  const { imgRef, gridRef, onSliderMove, finishPreviewResize } = usePreviewResize()
  const dispatch = useDispatch()
  const mainMenuProps = useMainMenuProps()
  const galleryProps = useGalleryProps()
  const location = useLocation()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, imageArr } = mainGalleryProps

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))
  const folderParam = query.get('folder') || undefined

  useEffect(() => {
    isEmpty(imageArr) &&
      !isFilesLoaded &&
      dispatch(
        fetchPhotos({
          isNameComparison: isComparisonPage,
          comparisonFolder: folderParam,
        })
      )
    setIsFilesLoaded(true)
  }, [dispatch, folderParam, imageArr, isComparisonPage, isFilesLoaded])

  return (
    <Layout>
      <MainMenu {...mainMenuProps} menuRef={menuRef} />
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      </div>
      <Layout>
        <Content style={{ gridTemplateRows: 'auto auto auto 1fr auto' }}>
          <CustomAlert message="Edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT)} type="info" />
          <CustomAlert message="Bulk edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT_BULK)} type="success" />
          <GalleryTopMenu finishPreviewResize={finishPreviewResize} onSliderMove={onSliderMove} />
          <Gallery {...galleryProps} gridRef={gridRef} imgRef={imgRef} />
          {!isComparisonPage && <PaginationMenu />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
