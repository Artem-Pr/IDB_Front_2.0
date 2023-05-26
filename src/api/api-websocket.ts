/* eslint functional/immutable-data: 0 */
import { HOST } from './api-client'
import type { WebSocketAPICallback, WebSocketAPIRequest } from './types'
import { WEB_SOCKET_ACTIONS } from './types'

interface InitWebSocketCallback {
  onMessage: (data: WebSocketAPICallback) => void
}

export const initWebSocket = (action: WEB_SOCKET_ACTIONS, { onMessage }: InitWebSocketCallback) => {
  const socket = new WebSocket(HOST.WEB_SOCKET)
  socket.onopen = event => {
    console.info('web-socket onopen', event)
    socket.send(JSON.stringify({ action }))
  }

  socket.onmessage = (rawResponse: MessageEvent<string>) => {
    const response: WebSocketAPIRequest = JSON.parse(rawResponse.data)
    onMessage(response.data)
  }
}
