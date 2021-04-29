import React from 'react'
import { Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { DropZone, Gallery, MainMenu } from '../../Components'
import { uploadPageGalleryProps } from '../../../redux/selectors'
import {
  addToSelectedList,
  clearSelectedList,
  removeFromSelectedList,
} from '../../../redux/reducers/uploadSlice-reducer'

const { Content } = Layout

const UploadPage = () => {
  const dispatch = useDispatch()
  const props = useSelector(uploadPageGalleryProps)
  const galleryProps = {
    ...props,
    removeFromSelectedList: (index: number) => dispatch(removeFromSelectedList(index)),
    addToSelectedList: (index: number) => dispatch(addToSelectedList(index)),
    clearSelectedList: () => dispatch(clearSelectedList()),
  }

  return (
    <Layout>
      <MainMenu />
      <Layout>
        <Content>
          <DropZone />
          <Gallery {...galleryProps} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
