import React, { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Layout } from 'antd'

import { UppyUploadButton } from 'src/app/components/UppyUploader/UppyUploadButton'
import { MainMenuKeys, PagePaths } from 'src/common/constants'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'
import {
  uploadReducerAddToSelectedList,
  uploadReducerClearSelectedList,
  uploadReducerRemoveFromSelectedList,
} from 'src/redux/reducers/uploadSlice'
import {
  getUploadReducerFilesArr,
  getUploadReducerOpenMenus,
  getUploadReducerSelectedList,
  getUploadReducerUploadStatus,
} from 'src/redux/reducers/uploadSlice/selectors'

import { useMenuResize, useGridRefControl } from '../../common/hooks'
import {
  CustomAlert, DropZone, Gallery, GalleryTopMenu, MainMenu, ResizeDivider,
} from '../../components'

const { Content } = Layout

const UploadPage = memo(() => {
  const { menuRef, handleDividerMove, handleFinishResize } = useMenuResize()
  const { refs, onSliderMove, finishPreviewResize } = useGridRefControl()
  const dispatch = useDispatch()
  const uploadingStatus = useSelector(getUploadReducerUploadStatus)
  const imageArr = useSelector(getUploadReducerFilesArr)
  const openMenus = useSelector(getUploadReducerOpenMenus)
  const selectedList = useSelector(getUploadReducerSelectedList)
  const isNewUploader = useSelector(getSettingsReducerIsNewUploader)
  const showTopGalleryMenu = imageArr.length !== 0

  useEffect(() => {
    dispatch(sessionReducerSetCurrentPage(PagePaths.UPLOAD))

    return () => {
      dispatch(sessionReducerSetCurrentPage(null))
    }
  }, [dispatch])

  const galleryProps = {
    imageArr,
    openMenus,
    selectedList,
    removeFromSelectedList: (indexArr: number[]) => dispatch(uploadReducerRemoveFromSelectedList(indexArr)),
    addToSelectedList: (indexArr: number[]) => dispatch(uploadReducerAddToSelectedList(indexArr)),
    clearSelectedList: () => dispatch(uploadReducerClearSelectedList()),
    isLoading: false,
  }

  return (
    <Layout>
      <MainMenu menuRef={menuRef} />
      <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      <Layout>
        <Content style={{ gridTemplateRows: 'auto auto auto auto 1fr' }}>
          {isNewUploader
            ? <UppyUploadButton />
            : <DropZone loadingStatus={uploadingStatus} openMenus={openMenus} /> }
          <CustomAlert message="Edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT)} type="info" />
          <CustomAlert message="Bulk edit mode" hide={!openMenus.includes(MainMenuKeys.EDIT_BULK)} type="success" />
          {showTopGalleryMenu && (
            <GalleryTopMenu onSliderMove={onSliderMove} finishPreviewResize={finishPreviewResize} />
          )}
          <Gallery {...galleryProps} refs={refs} />
        </Content>
      </Layout>
    </Layout>
  )
})

export default UploadPage
