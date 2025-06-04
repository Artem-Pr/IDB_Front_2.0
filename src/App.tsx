import React, { memo } from 'react'
import { Route, Switch } from 'react-router-dom'

import { Layout } from 'antd'

import { useFirstFetch } from './app/common/hooks/useFirstFetch'
import { Header } from './app/components'
import { ProtectedRoute } from './app/components/ProtectedRoute'
import { UppyUploader } from './app/components/UppyUploader/UppyUploaderDashboard'
import { useUppyUploader } from './app/components/UppyUploader/hooks/useUppyUploader'
import { LoginPage } from './app/pages/LoginPage'
import MainPage from './app/pages/MainPage'
import { SettingsPage } from './app/pages/SettingsPage'
import TestDB from './app/pages/TestDB'
import UploadPage from './app/pages/UploadPage'
import { UppyInstanceContext } from './common/UppyInstanceContext'
import { PagePaths } from './common/constants'

const App = memo(() => {
  useFirstFetch()
  const uppy = useUppyUploader()

  return (
    <Layout>
      <UppyInstanceContext.Provider value={uppy}>
        <Header />
        <Switch>
          <Route exact path={PagePaths.LOGIN} component={LoginPage} />
          <ProtectedRoute>
            <Route exact path={PagePaths.UPLOAD} component={UploadPage} />
            <Route exact path={PagePaths.SETTINGS} component={SettingsPage} />
            <Route exact path={PagePaths.TEST_DB} component={TestDB} />
            <Route exact path={PagePaths.MAIN} component={MainPage} />
          </ProtectedRoute>
        </Switch>
        <UppyUploader />
      </UppyInstanceContext.Provider>
    </Layout>
  )
})

export default App
