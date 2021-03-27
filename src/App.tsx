import React from 'react'
import { Layout } from 'antd'

import UploadPage from './app/Pages/UploadPage'
import { Header } from './app/Components'

function App() {
  return (
    <Layout>
      <Header />
      <UploadPage />
    </Layout>
  )
}

export default App
