import React, { memo, useEffect, useState } from 'react'
import { Button, List, Progress } from 'antd'

import { initWebSocket } from '../../../../../api/api-websocket'
import { API_STATUS, WEB_SOCKET_ACTIONS, WebSocketAPICallback } from '../../../../../api/types'

import styles from './SyncPreviews.module.scss'

const MESSAGE_LIST_LIMIT = 1000
const isStopped = (status: API_STATUS) =>
  status === API_STATUS.STOPPED ||
  status === API_STATUS.DONE ||
  status === API_STATUS.ERROR ||
  status === API_STATUS.PENDING_ERROR

export const SyncPreviews = memo(() => {
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMessageList, setShowMessageList] = useState(false)
  const [status, setStatus] = useState<API_STATUS>(API_STATUS.DEFAULT)
  const [webSocket, setWebSocket] = useState<ReturnType<typeof initWebSocket> | null>(null)

  useEffect(() => {
    const refreshWebSocketInstance = () => {
      webSocket?.close()
      setWebSocket(null)
      setStatus(API_STATUS.DEFAULT)
    }

    isStopped(status) && refreshWebSocketInstance()
  })

  const handleProcessStart = () => {
    setMessages([])
    setProgress(0)

    const onMessage = ({ message, progress, status }: WebSocketAPICallback) => {
      setMessages(prevMessages => [
        message,
        ...(prevMessages.length === MESSAGE_LIST_LIMIT ? prevMessages.slice(1) : prevMessages),
      ])
      setProgress(progress)
      setStatus(status)
    }

    const ws = initWebSocket(WEB_SOCKET_ACTIONS.SYNC_PREVIEWS, { onMessage })
    setWebSocket(ws)
    setStatus(API_STATUS.INIT)
  }

  const handleShowMessageListToggle = () => {
    setShowMessageList(prevValue => !prevValue)
  }

  return (
    <div className="d-flex align-items-center">
      <div>
        <Button block onClick={handleProcessStart}>
          Start process
        </Button>
        {Boolean(messages.length) && (
          <Button block onClick={handleShowMessageListToggle}>
            {showMessageList ? 'Hide all messages' : 'Show all messages'}
          </Button>
        )}
      </div>
      {Boolean(messages.length) && (
        <div className="margin-left-10 w-100">
          {showMessageList ? (
            <List
              className={styles.progress}
              size="small"
              dataSource={messages}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          ) : (
            <span>{messages[0]}</span>
          )}
          <Progress percent={progress} />
        </div>
      )}
    </div>
  )
})
