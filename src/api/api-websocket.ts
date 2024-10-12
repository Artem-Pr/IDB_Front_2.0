import { errorMessage } from '../app/common/notifications'

import { HOST } from './api-client'
import type { WebSocketAPICallback, WebSocketAPIQuery, WebSocketAPIRequest } from './types/types'
import { ApiStatus, WebSocketActions } from './types/types'

interface InitWebSocketCallback<T = undefined> {
  onMessage: (data: WebSocketAPICallback<T>) => void
  onError: () => void
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

export const initWebSocket = <T = undefined>(
  action: WebSocketActions,
  { onMessage, data }: InitWebSocketCallback<T>,
) => {
  const errorHandler = (errorTitle: string, error: Error, response?: WebSocketAPIRequest<T>) => {
    console.error(error)
    errorMessage(new Error(error.message), errorTitle, 100)
    response && onMessage(response.data)
  }

  const init = () => {
    socket = new WebSocket(HOST.WEB_SOCKET)

    socket.onopen = event => {
      console.info('web-socket onopen', event)
      send({
        action,
        ...(data && { data }),
      })
    }

    socket.onmessage = (rawResponse: MessageEvent<string>) => {
      const response: WebSocketAPIRequest<T> = JSON.parse(rawResponse.data)
      response.data.status === ApiStatus.ERROR
        ? errorHandler(response.data.message, new Error(`${response.action} ERROR`), response)
        : onMessage(response.data)
    }

    socket.onerror = error => {
      console.error(error)
      errorHandler('WebSocket', new Error('error'))
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
