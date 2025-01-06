import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const HOST = Object.freeze({
  HTTP: process.env.BACKEND_URL || '0.0.0.0',
  WEB_SOCKET: process.env.BACKEND_WEB_SOCKET_URL || '0.0.0.0',
})

interface Aborter {
  [key: string]: AbortController | null
}

let cancelController: Aborter = {}

const exceptionUrlList = ['/upload-file']

export const axiosInstance = axios.create({
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

const setAbortController = (config: InternalAxiosRequestConfig<AxiosRequestConfig>) => (
  config.url && !exceptionUrlList.includes(config.url)
    ? { ...config, signal: getAbortControllerSignal(config.url) }
    : config
)

const resetAbortController = (response: AxiosResponse) => {
  const responseUrl = response.config.url
  responseUrl && removeAborterItem(responseUrl)
  return response
}

axiosInstance.interceptors.request.use(setAbortController)
axiosInstance.interceptors.response.use(resetAbortController)
