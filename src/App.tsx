import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Layout, Spin } from 'antd'

import { Header } from './app/components'
import MainPage from './app/pages/MainPage'
import { SettingsPage } from './app/pages/SettingsPage'
import TestDB from './app/pages/TestDB'
import UploadPage from './app/pages/UploadPage'
import { globalLoader } from './redux/selectors'

const App = () => {
  const loading = useSelector(globalLoader)

  return (
    <Layout>
      <Header />
      <Spin spinning={loading}>
        <Switch>
          <Route exact path="/upload" component={UploadPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/test-db" component={TestDB} />
          <Route component={MainPage} />
        </Switch>
      </Spin>
    </Layout>
  )
}

export default App
