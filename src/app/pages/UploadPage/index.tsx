import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Layout, Result } from 'antd'

import { MainMenuKeys, PagePaths } from 'src/common/constants'
import { getFolderReducerFolderInfoCurrentFolder } from 'src/redux/reducers/foldersSlice/selectors'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'
import {
  uploadReducerAddToSelectedList,
  uploadReducerClearSelectedList,
  uploadReducerRemoveFromSelectedList,
  uploadReducerSetOpenMenus,
  uploadReducerSelectAll,
  uploadReducerSetFilesArr,
  uploadReducerClearState,
} from 'src/redux/reducers/uploadSlice'
import {
  getUploadReducerSameKeywords,
  getUploadReducerKeywords,
  getUploadReducerFilesArr,
  getUploadReducerOpenMenus,
  getUploadReducerSelectedList,
  getUploadReducerUploadStatus,
} from 'src/redux/reducers/uploadSlice/selectors'

import { useMenuResize, useGridRefControl } from '../../common/hooks'
import { removeIntersectingKeywords } from '../../common/utils'
import {
  CustomAlert, DropZone, Gallery, GalleryTopMenu, MainMenu, ResizeDivider, UppyUploader,
} from '../../components'

const { Content } = Layout

const UploadPage = () => {
  const { menuRef, handleDividerMove, handleFinishResize } = useMenuResize()
  const { refs, onSliderMove, finishPreviewResize } = useGridRefControl()
  const dispatch = useDispatch()
  const uploadingStatus = useSelector(getUploadReducerUploadStatus)
  const uniqKeywords = useSelector(getUploadReducerKeywords)
  const sameKeywords = useSelector(getUploadReducerSameKeywords)
  const imageArr = useSelector(getUploadReducerFilesArr)
  const openMenus = useSelector(getUploadReducerOpenMenus)
  const selectedList = useSelector(getUploadReducerSelectedList)
  const currentFolderPath = useSelector(getFolderReducerFolderInfoCurrentFolder)
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

  const mainMenuProps = {
    filesArr: imageArr,
    selectedList,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(uploadReducerClearSelectedList()),
    selectAll: () => dispatch(uploadReducerSelectAll()),
    updateOpenMenus: (value: MainMenuKeys[]) => dispatch(uploadReducerSetOpenMenus(value)),
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
      dispatch(uploadReducerSetFilesArr(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(uploadReducerClearState()),
  }

  return (
    <Layout>
      <MainMenu {...mainMenuProps} menuRef={menuRef} />
      <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      <Layout>
        <Content style={{ gridTemplateRows: 'auto auto auto auto 1fr' }}>
          {isNewUploader
            ? <UppyUploader />
            : <DropZone loadingStatus={uploadingStatus} openMenus={openMenus} /> }
          {uploadingStatus === 'success' && (
            <Result
              status="success"
              title="Files have been successfully uploaded"
            />
          )}
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
}

export default UploadPage
