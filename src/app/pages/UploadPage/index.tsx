import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Result } from 'antd'

import { MainMenuKeys, PagePaths } from 'src/common/constants'
import { getFolderReducerFolderInfoCurrentFolder } from 'src/redux/reducers/foldersSlice/selectors'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
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
import { LoadingStatus } from 'src/redux/types'

import { useMenuResize, useGridRefControl } from '../../common/hooks'
import { isValidResultStatus, removeIntersectingKeywords } from '../../common/utils'
import {
  CustomAlert, DropZone, Gallery, GalleryTopMenu, MainMenu, ResizeDivider,
} from '../../components'

const { Content } = Layout

const statusMessage: Record<LoadingStatus, string> = {
  success: 'Files have been successfully uploaded',
  error: 'Sending failed',
  loading: 'Loading...',
  empty: '',
}

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

  const ResultComponent = useMemo(() => {
    const validStatus = isValidResultStatus(uploadingStatus)
    if (validStatus) {
      return (
        <Result
          status={validStatus}
          title={statusMessage[uploadingStatus]}
        />
      )
    }

    if (uploadingStatus === 'loading') {
      return (
        <Result
          icon={<LoadingOutlined />}
          title={statusMessage[uploadingStatus]}
        />
      )
    }

    return ''
  }, [uploadingStatus])

  return (
    <Layout>
      <MainMenu {...mainMenuProps} menuRef={menuRef} />
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <ResizeDivider onDividerMove={handleDividerMove} onMouseUp={handleFinishResize} />
      </div>
      <Layout>
        <Content style={{ gridTemplateRows: 'auto auto auto auto 1fr' }}>
          <DropZone openMenus={openMenus} />
          {ResultComponent}
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
