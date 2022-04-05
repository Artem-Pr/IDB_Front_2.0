import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'

import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './redux/store/store'

import 'antd/dist/antd.css'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import './styles/index.scss'

// eslint-disable-next-line functional/immutable-data
Object.typedKeys = Object.keys

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
