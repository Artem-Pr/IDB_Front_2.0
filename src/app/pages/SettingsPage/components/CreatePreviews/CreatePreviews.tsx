import React, {
  memo, useCallback, useEffect, useState,
} from 'react'
import { useSelector } from 'react-redux'

import {
  AutoComplete, Button, List, Progress, Select,
} from 'antd'
import { keys } from 'ramda'

import { initWebSocket } from 'src/api/api-websocket'
import { ApiStatus, WebSocketActions, WebSocketAPICallback } from 'src/api/types/types'
import { MimeTypes } from 'src/common/constants'
import { getFolderReducerPathsArrOptionsSelector } from 'src/redux/reducers/foldersSlice/selectors'

import styles from './CreatePreviews.module.scss'

const { Option } = Select
const fileTypes = keys(MimeTypes)

const MESSAGE_LIST_LIMIT = 1000
const isProcessing = (status: ApiStatus) => status === ApiStatus.PENDING
 || status === ApiStatus.INIT
 || status === ApiStatus.PENDING_ERROR
 || status === ApiStatus.PENDING_SUCCESS
const isStopped = (status: ApiStatus) => status === ApiStatus.STOPPED
  || status === ApiStatus.DONE
  || status === ApiStatus.ERROR

export const CreatePreviews = memo(() => {
  const options = useSelector(getFolderReducerPathsArrOptionsSelector)
  const [mimeTypes, setMimeTypes] = useState<MimeTypes[]>([])
  const [folderPath, setFolderPath] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMessageList, setShowMessageList] = useState(false)
  const [status, setStatus] = useState<ApiStatus>(ApiStatus.READY)
  const [webSocket, setWebSocket] = useState<ReturnType<typeof initWebSocket> | null>(null)

  const processing = isProcessing(status)

  const refreshWebSocketInstance = useCallback(() => {
    webSocket?.close()
    setWebSocket(null)
    setStatus(ApiStatus.READY)
  }, [webSocket])

  useEffect(() => {
    isStopped(status) && refreshWebSocketInstance()
  }, [refreshWebSocketInstance, status])

  const handleFolderChange = (currentFolderPath: string) => {
    setFolderPath(currentFolderPath)
  }

  const handleFileTypesChange = (value: MimeTypes[]) => {
    setMimeTypes(value)
  }

  const handleFilterOption = (inputValue: string, option: { value: string } | undefined) => option?.value.toUpperCase()
    .indexOf(inputValue.toUpperCase()) !== -1

  const handleProcess = () => {
    processing ? stopProcess() : startProcess()
  }

  const stopProcess = () => {
    webSocket
      && webSocket.send({
        action: WebSocketActions.CREATE_PREVIEWS_STOP,
      })
  }

  const startProcess = () => {
    setMessages([])
    setProgress(0)

    const onMessage = (action: WebSocketAPICallback) => {
      setMessages(prevMessages => [
        action.message,
        ...(prevMessages.length === MESSAGE_LIST_LIMIT ? prevMessages.slice(0, -1) : prevMessages),
      ])
      action.progress && setProgress(action.progress)
      setStatus(action.status)
    }

    const onError = () => {
      refreshWebSocketInstance()
      stopProcess()
    }

    const ws = initWebSocket(WebSocketActions.CREATE_PREVIEWS, {
      onMessage,
      onError,
      data: { folderPath, mimeTypes },
    })
    setWebSocket(ws)
    setStatus(ApiStatus.INIT)
  }

  const handleShowMessageListToggle = () => {
    setShowMessageList(prevValue => !prevValue)
  }

  return (
    <div className="d-flex align-items-center">
      <div>
        <div className={styles.selectors}>
          <div>Folder:</div>
          <AutoComplete
            className="w-100"
            placeholder="write folder name"
            options={options}
            value={folderPath}
            defaultValue={folderPath}
            onChange={handleFolderChange}
            filterOption={handleFilterOption}
          />
          <div>File type:</div>
          <Select
            className="w-100"
            mode="tags"
            placeholder="select files type"
            onChange={handleFileTypesChange}
            value={mimeTypes}
          >
            {fileTypes.map(type => (
              <Option key={type} value={MimeTypes[type]}>
                {type}
              </Option>
            ))}
          </Select>
        </div>
        <Button block onClick={handleProcess}>
          {processing ? 'Stop process' : 'Start process'}
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
