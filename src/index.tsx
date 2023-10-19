import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'

import dayjs from 'dayjs'

import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './redux/store/store'

import 'react-image-gallery/styles/scss/image-gallery.scss'
import './styles/index.scss'

// eslint-disable-next-line functional/immutable-data
Object.typedKeys = Object.keys

const container = document.querySelector('#root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
