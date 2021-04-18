import React from 'react'
import { Layout } from 'antd'

import { DropZone, MainMenu } from '../../Components'

const { Content } = Layout

const UploadPage = () => {
  return (
    <Layout>
      <MainMenu />
      <Layout>
        <Content>
          <DropZone />
        </Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
