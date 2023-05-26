import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export enum HOST {
  HTTP = 'http://localhost:5000',
  WEB_SOCKET = 'ws://localhost:5001',
}

interface Aborter {
  [key: string]: AbortController | null
}

// eslint-disable-next-line functional/no-let
let cancelController: Aborter = {}

const exceptionUrlList = ['/uploadItem']

export const instance = axios.create({
  baseURL: HOST.HTTP,
})

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

const setAbortController = (config: AxiosRequestConfig) => {
  return config.url && !exceptionUrlList.includes(config.url)
    ? { ...config, signal: getAbortControllerSignal(config.url) }
    : config
}

const resetAbortController = (response: AxiosResponse) => {
  const responseUrl = response.config.url
  responseUrl && removeAborterItem(responseUrl)
  return response
}

instance.interceptors.request.use(setAbortController)
instance.interceptors.response.use(resetAbortController)
