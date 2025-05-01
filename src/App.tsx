import React, { memo } from 'react'
import { Route, Switch } from 'react-router-dom'

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
        <Switch>
          <Route exact path="/upload" component={UploadPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/test-db" component={TestDB} />
          <Route component={MainPage} />
        </Switch>
        <UppyUploader />
      </UppyInstanceContext.Provider>
    </Layout>
  )
})

export default App
