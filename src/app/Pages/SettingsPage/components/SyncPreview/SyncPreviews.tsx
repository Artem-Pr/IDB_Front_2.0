import React, { memo, useState } from 'react'
import { Button, List, Progress } from 'antd'

import { initWebSocket } from '../../../../../api/api-websocket'
import { WEB_SOCKET_ACTIONS, WebSocketAPICallback } from '../../../../../api/types'

import styles from './SyncPreviews.module.scss'

export const SyncPreviews = memo(() => {
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMessageList, setShowMessageList] = useState(false)

  const handleProcessStart = () => {
    setMessages([])
    setProgress(0)

    const onMessage = ({ message, progress }: WebSocketAPICallback) => {
      setMessages(prevMessages => [message, ...prevMessages])
      setProgress(progress)
    }

    initWebSocket(WEB_SOCKET_ACTIONS.SYNC_PREVIEWS, { onMessage })
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
