import React from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { CustomAlert, DropZone, Gallery, MainMenu } from '../../Components'
import { upload, uploadPageGalleryPropsSelector } from '../../../redux/selectors'
import { clearSelectedList, removeFromSelectedList, updateOpenMenus } from '../../../redux/reducers/uploadSlice-reducer'
import { useUpdateFields } from '../../common/hooks'

const { Content } = Layout

const UploadPage = () => {
  const dispatch = useDispatch()
  const { openMenus, uploadingFiles, selectedList } = useSelector(upload)
  const props = useSelector(uploadPageGalleryPropsSelector)
  const { updateUploadingFiles } = useUpdateFields()

  const galleryProps = {
    ...props,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => updateUploadingFiles(index),
    clearSelectedList: () => dispatch(clearSelectedList()),
  }

  const mainMenuProps = {
    uploadingFiles,
    selectedList,
    openKeys: openMenus,
    clearSelectedList: () => dispatch(clearSelectedList()),
    updateOpenMenus: (value: string[]) => dispatch(updateOpenMenus(value)),
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
