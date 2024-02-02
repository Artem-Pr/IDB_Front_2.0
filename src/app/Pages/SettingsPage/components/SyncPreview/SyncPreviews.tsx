import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Button, List, Progress } from 'antd'

import { initWebSocket } from '../../../../../api/api-websocket'
import { ApiStatus, WebSocketActions, WebSocketAPICallback } from '../../../../../api/types'

import styles from './SyncPreviews.module.scss'

const MESSAGE_LIST_LIMIT = 1000
const isStopped = (status: ApiStatus) => status === ApiStatus.STOPPED
  || status === ApiStatus.DONE
  || status === ApiStatus.ERROR
  || status === ApiStatus.PENDING_ERROR

export const SyncPreviews = memo(() => {
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMessageList, setShowMessageList] = useState(false)
  const [status, setStatus] = useState<ApiStatus>(ApiStatus.DEFAULT)
  const [webSocket, setWebSocket] = useState<ReturnType<typeof initWebSocket> | null>(null)

  const refreshWebSocketInstance = useCallback(() => {
    webSocket?.close()
    setWebSocket(null)
    setStatus(ApiStatus.DEFAULT)
  }, [webSocket])

  useEffect(() => {
    isStopped(status) && refreshWebSocketInstance()
  }, [refreshWebSocketInstance, status])

  const handleProcessStart = () => {
    setMessages([])
    setProgress(0)

    const onMessage = (action: WebSocketAPICallback) => {
      setMessages(prevMessages => [
        action.message,
        ...(prevMessages.length === MESSAGE_LIST_LIMIT ? prevMessages.slice(0, -1) : prevMessages),
      ])
      setProgress(action.progress)
      setStatus(action.status)
    }

    const ws = initWebSocket(WebSocketActions.SYNC_PREVIEWS, { onMessage, onError: refreshWebSocketInstance })
    setWebSocket(ws)
    setStatus(ApiStatus.INIT)
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
          {showMessageList
            ? (
              <List
                className={styles.progress}
                size="small"
                dataSource={messages}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            )
            : (
              <span>{messages[0]}</span>
            )}
          <Progress percent={progress} />
        </div>
      )}
    </div>
  )
})
