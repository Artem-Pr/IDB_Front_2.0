import React from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CustomAlert, DropZone, Gallery, MainMenu } from '../../Components'
import { allUploadKeywords, upload, uploadPageGalleryPropsSelector } from '../../../redux/selectors'
import {
  addToSelectedList,
  clearSelectedList,
  removeFromSelectedList,
  updateOpenMenus,
  selectAll,
} from '../../../redux/reducers/uploadSlice-reducer'
import { useUpdateFields } from '../../common/hooks'
import { GalleryProps } from '../../Components/Gallery'

const { Content } = Layout

const UploadPage = () => {
  const dispatch = useDispatch()
  const { openMenus, uploadingFiles, selectedList, loading } = useSelector(upload)
  const uniqKeywords = useSelector(allUploadKeywords)
  const props = useSelector(uploadPageGalleryPropsSelector)
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
    openKeys: openMenus,
    clearSelectedList: () => dispatch(clearSelectedList()),
    selectAll: () => {
      dispatch(selectAll())
      updateUploadingFiles('_', true)
    },
    updateOpenMenus: (value: string[]) => dispatch(updateOpenMenus(value)),
    updateKeywords: (): Promise<any> => updateUploadingFiles('_', true),
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
