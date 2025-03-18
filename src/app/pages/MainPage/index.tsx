import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Layout } from 'antd'

import { MainMenuKeys, PagePaths } from 'src/common/constants'
import { getMainPageReducerFilesArr, getMainPageReducerOpenMenus } from 'src/redux/reducers/mainPageSlice/selectors'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
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
  const { refs, onSliderMove, finishPreviewResize } = useGridRefControl()
  const dispatch = useAppDispatch()
  const galleryProps = useGalleryProps()
  const openMenus = useSelector(getMainPageReducerOpenMenus)
  const imageArr = useSelector(getMainPageReducerFilesArr)

  useEffect(() => {
    dispatch(sessionReducerSetCurrentPage(PagePaths.MAIN))

    return () => {
      dispatch(sessionReducerSetCurrentPage(null))
    }
  }, [dispatch])

  useEffect(() => {
    !imageArr.length && dispatch(fetchPhotos())
  }, [dispatch, imageArr.length])

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
          />
          <Gallery {...galleryProps} refs={refs} />
          <PaginationMenu />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainPage
