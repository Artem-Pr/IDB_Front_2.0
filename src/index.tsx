import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { createRoot } from 'react-dom/client'

import App from './App'
import store from './redux/store/store'
import * as serviceWorker from './serviceWorker'

import './styles/index.scss'
import 'react-image-gallery/styles/scss/image-gallery.scss'

dayjs.extend(duration)

const container = document.querySelector('#root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
