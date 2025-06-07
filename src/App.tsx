import React, { memo } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Layout } from 'antd'

import { Header } from './app/components'
import { UppyUploader } from './app/components/UppyUploader/UppyUploaderDashboard'
import { useUppyUploader } from './app/components/UppyUploader/hooks/useUppyUploader'
import MainPage from './app/pages/MainPage'
import { SettingsPage } from './app/pages/SettingsPage'
import TestDB from './app/pages/TestDB'
import UploadPage from './app/pages/UploadPage'
import { UppyInstanceContext } from './common/UppyInstanceContext'

const App = memo(() => {
  const uppy = useUppyUploader()

  return (
    <Layout>
      <UppyInstanceContext.Provider value={uppy}>
        <Header />
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test-db" element={<TestDB />} />
          <Route element={<MainPage />} />
        </Routes>
        <UppyUploader />
      </UppyInstanceContext.Provider>
    </Layout>
  )
})

export default App
