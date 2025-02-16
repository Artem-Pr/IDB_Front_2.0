import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { Layout } from 'antd'
import { isEmpty } from 'ramda'

import { MainMenuKeys, PagePaths } from 'src/common/constants'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { setCurrentPage } from 'src/redux/reducers/sessionSlice'
import { dPageGalleryPropsSelector } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { useMenuResize, useGridRefControl } from '../../common/hooks'
import {
  CustomAlert, Gallery, GalleryTopMenu, MainMenu, ResizeDivider, PaginationMenu,
} from '../../components'

import { useGalleryProps } from './hooks'

const { Content } = Layout

const MainPage = () => {
  const {
    menuRef, videoPreviewRef, handleDividerMove, handleFinishResize,
  } = useMenuResize()
  const {
    refs, onSliderMove, finishPreviewResize, setScrollUpWhenUpdating,
  } = useGridRefControl()
  const dispatch = useAppDispatch()
  const galleryProps = useGalleryProps()
  const location = useLocation()
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const mainGalleryProps = useSelector(dPageGalleryPropsSelector)
  const { openMenus, imageArr } = mainGalleryProps

  const query = new URLSearchParams(location.search)
  const isComparisonPage = Boolean(query.get('comparison'))
  const folderParam = query.get('folder') || undefined

  useEffect(() => {
    dispatch(setCurrentPage(PagePaths.MAIN))

    return () => {
      dispatch(setCurrentPage(null))
    }
  }, [dispatch])

  useEffect(() => {
    isEmpty(imageArr)
      && !isFilesLoaded
      && dispatch(
        fetchPhotos({
          isNameComparison: isComparisonPage,
          comparisonFolder: folderParam,
        }),
      )
    setIsFilesLoaded(true)
  }, [dispatch, folderParam, imageArr, isComparisonPage, isFilesLoaded])

  return (
    <Layout>
      <MainMenu menuRef={menuRef} videoPreviewRef={videoPreviewRef} />
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      </div>
      <Layout>
        <Content style={{ gridTemplateRows: 'auto auto auto 1fr auto' }}>
          <CustomAlert message="Edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT)} type="info" />
          <CustomAlert message="Bulk edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT_BULK)} type="success" />
          <GalleryTopMenu
            finishPreviewResize={finishPreviewResize}
            onSliderMove={onSliderMove}
            setScrollUpWhenUpdating={setScrollUpWhenUpdating}
          />
          <Gallery {...galleryProps} refs={refs} />
          {!isComparisonPage && <PaginationMenu />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
