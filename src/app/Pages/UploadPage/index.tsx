import React from 'react'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'

import { DropZone, Gallery, MainMenu } from '../../Components'
import { upload } from '../../../redux/selectors'

const { Content } = Layout

const UploadPage = () => {
  const { uploadingFiles } = useSelector(upload)

  return (
    <Layout>
      <MainMenu />
      <Layout>
        <Content>
          <DropZone />
          <Gallery imageArr={uploadingFiles} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
