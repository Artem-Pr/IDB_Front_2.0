import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import '@ant-design/v5-patch-for-react-19'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { createRoot } from 'react-dom/client'

import App from './App'
import store from './redux/store/store'
import * as serviceWorker from './serviceWorker'

import './styles/index.scss'
// import 'react-image-gallery/styles/scss/image-gallery.scss'
import 'video.js/dist/video-js.css'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('UTC')

const container = document.querySelector('#root')
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
