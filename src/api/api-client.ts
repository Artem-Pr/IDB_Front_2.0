import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { PagePaths } from 'src/common/constants'

import { HOST } from './config'
import type { LoginCredentials } from './types/request-types'
import type { AuthResponse, RefreshTokenResponse } from './types/response-types'

interface Aborter {
  [key: string]: AbortController | null
}

let cancelController: Aborter = {}
let isRefreshing = false
let isInitializing = true
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const exceptionUrlList = ['/upload-file']

// Create a separate instance for auth to avoid circular dependency
const authAxios = axios.create({
  baseURL: HOST.HTTP,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosInstance = axios.create({
  baseURL: HOST.HTTP,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authAxios.post<AuthResponse>(`${HOST.HTTP}/auth/login`, credentials)
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await authAxios.post<RefreshTokenResponse>(`${HOST.HTTP}/auth/refresh`, { refreshToken })
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await authAxios.post(`${HOST.HTTP}/auth/logout`, { refreshToken })
  },

  setInitialized() {
    isInitializing = false
  },
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

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
  config.url && !exceptionUrlList.includes(config.url) && !isInitializing
    ? { ...config, signal: getAbortControllerSignal(config.url) }
    : config
)

const resetAbortController = (response: AxiosResponse) => {
  const responseUrl = response.config.url
  responseUrl && removeAborterItem(responseUrl)
  return response
}

const setAuthHeader = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const handleAuthError = async (error: any) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      processQueue(null, accessToken)
      return await axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // Redirect to login page
      window.location.href = PagePaths.LOGIN
      return await Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
}

authAxios.interceptors.request.use(setAuthHeader)
axiosInstance.interceptors.request.use(setAbortController)
axiosInstance.interceptors.request.use(setAuthHeader)
axiosInstance.interceptors.response.use(resetAbortController)
axiosInstance.interceptors.response.use(response => response, handleAuthError)
