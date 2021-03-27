import React from 'react'
import { Layout } from 'antd'

import { MainMenu } from '../../Components'

const { Content } = Layout

const UploadPage = () => {
  return (
    <Layout>
      <MainMenu />
      <Layout style={{ marginLeft: 300 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>Content</Content>
      </Layout>
    </Layout>
  )
}

export default UploadPage
