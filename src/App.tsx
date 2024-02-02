import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Layout, Spin } from 'antd'

import { Header } from './app/Components'
import MainPage from './app/Pages/MainPage'
import { SettingsPage } from './app/Pages/SettingsPage'
import TestDB from './app/Pages/TestDB'
import UploadPage from './app/Pages/UploadPage'
import { settings } from './redux/selectors'

const App = () => {
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
