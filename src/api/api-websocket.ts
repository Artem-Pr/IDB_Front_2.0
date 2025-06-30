import { errorMessage } from '../app/common/notifications'
import { getAccessTokenFromLocalStorage } from '../common/localStorageService'
import { getSessionReducerRefreshToken } from '../redux/reducers/sessionSlice/selectors'
import { logout, setAllTokens } from '../redux/reducers/sessionSlice/thunks'
import type { ReduxStore } from '../redux/store/types'

import { HOST } from './api-instance'
import { authApi } from './requests/api-requests'
import type { WebSocketAPICallback, WebSocketAPIQuery, WebSocketAPIRequest } from './types/types'
import { ApiStatus, WebSocketActions } from './types/types'

interface InitWebSocketCallback<T = undefined> {
  onMessage: (data: WebSocketAPICallback<T>) => void
  onError: () => void
  onAuthenticated?: (userData: any) => void
  data?: WebSocketAPIQuery['data']
}

export interface FilesTestAPIData {
  configFoldersCount: number
  DBFoldersCount: number
  DiscFoldersCount: number
  filesOnDisc: number
  filesInDB: number
  excessiveFolders__Config_Disk: string[]
  excessiveFolders__Disk_Config: string[]
  excessiveFolders__DB_Config: string[]
  excessiveFolders__Config_DB: string[]
  excessiveFolders__DB_Disc: string[]
  excessiveFolders__Disc_DB: string[]
  excessiveFolders__filesInDB: string[]
  excessiveFolders__filesOnDisc: string[]
}

let socket: WebSocket | null = null
const isSocketReady = () => socket && socket.readyState === WebSocket.OPEN

// Simple token refresh before WebSocket connection
async function ensureValidToken(store?: ReduxStore): Promise<boolean> {
  if (!store) {
    return true // No store provided, proceed with existing token
  }

  const { dispatch, getState } = store
  const refreshToken = getSessionReducerRefreshToken(getState())

  if (!refreshToken) {
    return false
  }

  try {
    const response = await authApi.refreshTokens(refreshToken)
    
    if (!response) {
      dispatch(logout())
      return false
    }

    dispatch(setAllTokens(response))
    return true
  } catch (error) {
    console.error('Token refresh failed before WebSocket connection:', error)
    dispatch(logout())
    return false
  }
}

export const initWebSocket = async <T = undefined>(
  action: WebSocketActions,
  { onMessage, onAuthenticated, data }: InitWebSocketCallback<T>,
  store?: ReduxStore,
) => {
  const errorHandler = (errorTitle: string, error: Error, response?: WebSocketAPIRequest<T>) => {
    console.error(error, response?.data.data)
    errorMessage(new Error(error?.message), errorTitle, 100)
    response && onMessage(response.data)
  }

  // Refresh token before establishing WebSocket connection
  const tokenValid = await ensureValidToken(store)
  if (!tokenValid) {
    errorHandler('WebSocket Authentication', new Error('Failed to refresh token'))
    return { send: () => {}, close: () => {} }
  }

  const init = () => {
    const token = getAccessTokenFromLocalStorage()
    
    // Browser WebSocket API doesn't support headers directly.
    // Pass token as query parameter for authentication.
    const wsUrl = token 
      ? `${HOST.WEB_SOCKET}?token=${encodeURIComponent(token)}`
      : HOST.WEB_SOCKET
      
    socket = new WebSocket(wsUrl)

    socket.onopen = event => {
      console.info('web-socket onopen', event)
      // Don't send the initial action immediately - wait for authentication response first
    }

    socket.onmessage = (rawResponse: MessageEvent<string>) => {
      const response: WebSocketAPIRequest<T> = JSON.parse(rawResponse.data)
      
      // Handle authentication response
      if (response.action === WebSocketActions.UNKNOWN_ACTION && response.data.status === ApiStatus.READY) {
        console.info('WebSocket authenticated:', response.data.message, response.data.data)
        onAuthenticated?.(response.data.data)
        
        // Now send the actual action request after authentication
        send({
          action,
          ...(data && { data }),
        })
        return
      }
      
      // Handle regular responses
      response.data.status === ApiStatus.ERROR
        ? errorHandler(response.data.message, new Error(`${response.action} ERROR`), response)
        : onMessage(response.data)
    }

    socket.onerror = error => {
      console.error('WebSocket error:', error)
      errorHandler('WebSocket', new Error('Connection error'))
    }
  }

  const send = (sendData: WebSocketAPIQuery) => {
    isSocketReady()
      ? socket?.send(JSON.stringify(sendData))
      : setTimeout(() => {
        send(sendData)
      }, 50)
  }

  const close = () => {
    const closeWebSocket = () => {
      socket?.close()
      socket = null
    }

    isSocketReady()
      ? closeWebSocket()
      : setTimeout(() => {
        close()
      }, 50)
  }

  !socket && init()

  return { send, close }
}
