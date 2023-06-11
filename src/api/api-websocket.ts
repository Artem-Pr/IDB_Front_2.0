/* eslint functional/immutable-data: 0 */
import { HOST } from './api-client'
import type { WebSocketAPICallback, WebSocketAPIRequest, WebSocketAPIQuery } from './types'
import { WEB_SOCKET_ACTIONS } from './types'
import { errorMessage } from '../app/common/notifications'

interface InitWebSocketCallback<T = undefined> {
  onMessage: (data: WebSocketAPICallback<T>) => void
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

// eslint-disable-next-line functional/no-let
let socket: WebSocket | null = null
const isSocketReady = () => socket && socket.readyState === WebSocket.OPEN

export const initWebSocket = <T = undefined>(
  action: WEB_SOCKET_ACTIONS,
  { onMessage, data }: InitWebSocketCallback<T>
) => {
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
      onMessage(response.data)
    }

    socket.onerror = error => {
      console.error(error)
      errorMessage(new Error('Error'), 'WebSocket')
    }
  }

  const send = (data: WebSocketAPIQuery) => {
    isSocketReady()
      ? socket?.send(JSON.stringify(data))
      : setTimeout(() => {
          send(data)
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
