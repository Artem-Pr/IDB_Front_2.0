import React from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CustomAlert, DropZone, Gallery, MainMenu } from '../../Components'
import {
  allSameKeywords,
  allUploadKeywords,
  folderElement,
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
import { removeIntersectingKeywords } from '../../common/utils'

const { Content } = Layout

const UploadPage = () => {
  const dispatch = useDispatch()
  const { openMenus, uploadingFiles, selectedList, loading } = useSelector(upload)
  const uniqKeywords = useSelector(allUploadKeywords)
  const sameKeywords = useSelector(allSameKeywords)
  const props = useSelector(uploadPageGalleryPropsSelector)
  const { currentFolderPath } = useSelector(folderElement)
  const { updateUploadingFiles } = useUpdateFields()

  const galleryProps: GalleryProps = {
    ...props,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToSelectedList(index)),
    clearSelectedList: () => dispatch(clearSelectedList()),
    updateFiles: (tempPath: string) => updateUploadingFiles(tempPath),
  }

  const mainMenuProps = {
    uploadingFiles,
    selectedList,
    loading,
    uniqKeywords,
    sameKeywords,
    openKeys: openMenus,
    currentFolderPath,
    clearSelectedList: () => dispatch(clearSelectedList()),
    selectAll: () => {
      dispatch(selectAll())
      updateUploadingFiles('_', true)
    },
    updateOpenMenus: (value: string[]) => dispatch(updateOpenMenus(value)),
    updateKeywords: (): Promise<any> => updateUploadingFiles('_', true),
    removeKeyword: (keyword: string) => {
      const filesArrWithoutKeyword = removeIntersectingKeywords([keyword], uploadingFiles)
      dispatch(updateUploadingFilesArr(filesArrWithoutKeyword))
    },
    removeFiles: () => dispatch(clearUploadingState()),
  }

  return (
    <Layout>
      <MainMenu {...mainMenuProps} />
      <Layout>
        <Content>
          <DropZone openMenus={openMenus} />
          <CustomAlert message="Edit mode" hide={!openMenus.includes('edit')} type="info" />
          <CustomAlert message="Template mode" hide={!openMenus.includes('template')} type="success" />
          <Gallery {...galleryProps} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
