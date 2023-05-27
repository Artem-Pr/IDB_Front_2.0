/* eslint functional/immutable-data: 0 */
import { HOST } from './api-client'
import type { WebSocketAPICallback, WebSocketAPIRequest, WebSocketAPIQuery } from './types'
import { WEB_SOCKET_ACTIONS } from './types'
import { errorMessage } from '../app/common/notifications'

interface InitWebSocketCallback {
  onMessage: (data: WebSocketAPICallback) => void
  data?: WebSocketAPIQuery['data']
}

// eslint-disable-next-line functional/no-let
let socket: WebSocket | null = null
const isSocketReady = () => socket && socket.readyState === WebSocket.OPEN

export const initWebSocket = (action: WEB_SOCKET_ACTIONS, { onMessage, data }: InitWebSocketCallback) => {
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
      const response: WebSocketAPIRequest = JSON.parse(rawResponse.data)
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
