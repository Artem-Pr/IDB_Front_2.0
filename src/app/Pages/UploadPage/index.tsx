import React, { useMemo } from 'react'
import { Layout, Result } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CustomAlert, DropZone, Gallery, MainMenu } from '../../Components'
import {
  allSameKeywordsSelector,
  allUploadKeywordsSelector,
  curFolderInfo,
  upload,
  uploadPageGalleryPropsSelector,
} from '../../../redux/selectors'
import {
  addToSelectedList,
  clearSelectedList,
  removeFromSelectedList,
  updateOpenMenus,
  selectAll,
  updateUploadingFilesArr,
  clearUploadingState,
} from '../../../redux/reducers/uploadSlice-reducer'
import { useUpdateFields } from '../../common/hooks'
import { GalleryProps } from '../../Components/Gallery'
import { isValidResultStatus, removeIntersectingKeywords } from '../../common/utils'
import { LoadingStatus } from '../../../redux/types'

const { Content } = Layout

const statusMessage: Record<LoadingStatus, string> = {
  success: 'Files uploaded successfully',
  error: 'Submission Failed',
  loading: '',
  empty: '',
}

const UploadPage = () => {
  const dispatch = useDispatch()
  const { isExifLoading, uploadingStatus } = useSelector(upload)
  const uniqKeywords = useSelector(allUploadKeywordsSelector)
  const sameKeywords = useSelector(allSameKeywordsSelector)
  const mainGalleryProps = useSelector(uploadPageGalleryPropsSelector)
  const { openMenus, selectedList, imageArr } = mainGalleryProps
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { updateUploadingFiles } = useUpdateFields(imageArr)

  const galleryProps: GalleryProps = {
    ...mainGalleryProps,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToSelectedList(index)),
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
    updateOpenMenus: (value: string[]) => dispatch(updateOpenMenus(value)),
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], imageArr)
      dispatch(updateUploadingFilesArr(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(clearUploadingState()),
  }

  const ResultComponent = useMemo(() => {
    const validStatus = isValidResultStatus(uploadingStatus)
    return validStatus ? <Result status={validStatus || 'info'} title={statusMessage[uploadingStatus]} /> : ''
  }, [uploadingStatus])

  return (
    <Layout>
      <MainMenu {...mainMenuProps} />
      <Layout>
        <Content>
          <DropZone openMenus={openMenus} />
          {ResultComponent}
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          <Gallery {...galleryProps} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
