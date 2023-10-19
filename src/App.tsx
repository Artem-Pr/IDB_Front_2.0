import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout, Spin } from 'antd'

import { useSelector } from 'react-redux'

import MainPage from './app/Pages/MainPage'
import UploadPage from './app/Pages/UploadPage'
import { SettingsPage } from './app/Pages/SettingsPage'
import TestDB from './app/Pages/TestDB'
import { Header } from './app/Components'
import { settings } from './redux/selectors'

function App() {
  const { globalLoader } = useSelector(settings)

  return (
    <Layout>
      <Header />
      <Spin spinning={globalLoader}>
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
