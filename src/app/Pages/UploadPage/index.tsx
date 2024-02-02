import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Result } from 'antd'

import {
  addToSelectedList,
  clearSelectedList,
  removeFromSelectedList,
  updateOpenMenus,
  selectAll,
  updateUploadingFilesArr,
  clearUploadingState,
} from '../../../redux/reducers/uploadSlice'
import {
  allSameKeywordsSelector,
  allUploadKeywordsSelector,
  curFolderInfo,
  upload,
  uploadPageGalleryPropsSelector,
} from '../../../redux/selectors'
import { LoadingStatus, MainMenuKeys } from '../../../redux/types'
import {
  CustomAlert, DropZone, Gallery, GalleryTopMenu, MainMenu,
} from '../../Components'
import { ResizeDivider } from '../../Components/ResizeDivider'
import { useUpdateFields, useMenuResize, useGridRefControl } from '../../common/hooks'
import { isValidResultStatus, removeIntersectingKeywords } from '../../common/utils'

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
  const { isExifLoading, uploadingStatus } = useSelector(upload)
  const uniqKeywords = useSelector(allUploadKeywordsSelector)
  const sameKeywords = useSelector(allSameKeywordsSelector)
  const mainGalleryProps = useSelector(uploadPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { updateUploadingFiles } = useUpdateFields(imageArr)
  const showTopGalleryMenu = mainGalleryProps.imageArr.length !== 0

  const galleryProps = {
    ...mainGalleryProps,
    removeFromSelectedList: (indexArr: number[]) => dispatch(removeFromSelectedList(indexArr)),
    addToSelectedList: (indexArr: number[]) => dispatch(addToSelectedList(indexArr)),
    clearSelectedList: () => dispatch(clearSelectedList()),
    updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
    isLoading: false,
  }

  const mainMenuProps = {
    filesArr: imageArr,
    selectedList,
    isExifLoading,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(clearSelectedList()),
    selectAll: () => dispatch(selectAll()),
    updateOpenMenus: (value: MainMenuKeys[]) => dispatch(updateOpenMenus(value)),
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
      dispatch(updateUploadingFilesArr(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(clearUploadingState()),
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
