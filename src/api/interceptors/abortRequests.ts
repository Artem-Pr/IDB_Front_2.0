import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { RequestUrl } from '../requests/api-requests-url-list'

interface Aborter {
  [key: string]: AbortController | null
}

let cancelController: Aborter = {}

const exceptionUrlList = [RequestUrl.UPLOAD_FILE, RequestUrl.REFRESH_TOKENS, RequestUrl.LOGIN, RequestUrl.LOGOUT]

const cancelAborterItem = (url: string) => {
  cancelController[url]?.abort()
}

const createAborterItem = (url: string) => {
  cancelController = { ...cancelController, [url]: new AbortController() }
}

const removeAborterItem = (url: string) => {
  cancelController = { ...cancelController, [url]: null }
}

const getAbortControllerSignal = (url: string) => {
  cancelAborterItem(url)
  createAborterItem(url)
  return cancelController[url]?.signal
}

export const setAbortController = (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => (
  config.url && !exceptionUrlList.includes(config.url)
    ? { ...config, signal: getAbortControllerSignal(config.url) }
    : config
)

export const resetAbortController = (response: AxiosResponse) => {
  const responseUrl = response.config.url
  responseUrl && removeAborterItem(responseUrl)
  return response
}
