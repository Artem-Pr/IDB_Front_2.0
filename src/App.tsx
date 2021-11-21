import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import UploadPage from './app/Pages/UploadPage'
import MainPage from './app/Pages/MainPage'
import TestDB from './app/Pages/TestDB'
import { Header } from './app/Components'

function App() {
  return (
    <Layout>
      <Header />
      <Switch>
        <Route exact path="/upload" component={UploadPage} />
        <Route exact path="/test-db" component={TestDB} />
        <Route component={MainPage} />
      </Switch>
    </Layout>
  )
}

export default App
