import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { Layout } from 'antd'

import { Header } from './app/components'
import MainPage from './app/pages/MainPage'
import { SettingsPage } from './app/pages/SettingsPage'
import TestDB from './app/pages/TestDB'
import UploadPage from './app/pages/UploadPage'

const App = () => (
  <Layout>
    <Header />
    <Switch>
      <Route exact path="/upload" component={UploadPage} />
      <Route exact path="/settings" component={SettingsPage} />
      <Route exact path="/test-db" component={TestDB} />
      <Route component={MainPage} />
    </Switch>
  </Layout>
)

export default App
