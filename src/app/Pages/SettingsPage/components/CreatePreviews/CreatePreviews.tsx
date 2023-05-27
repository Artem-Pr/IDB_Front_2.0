import React, { memo, useEffect, useState } from 'react'
import { AutoComplete, Button, List, Progress, Select } from 'antd'

import { useSelector } from 'react-redux'

import { keys } from 'ramda'

import { initWebSocket } from '../../../../../api/api-websocket'
import { API_STATUS, WEB_SOCKET_ACTIONS, WebSocketAPICallback } from '../../../../../api/types'

import styles from './CreatePreviews.module.scss'
import { pathsArrOptionsSelector } from '../../../../../redux/selectors'
import { MimeTypes } from '../../../../../redux/types/MimeTypes'

const { Option } = Select
const fileTypes = keys(MimeTypes)

const MESSAGE_LIST_LIMIT = 1000
const isProcessing = (status: API_STATUS) => status === API_STATUS.PENDING || status === API_STATUS.INIT
const isStopped = (status: API_STATUS) =>
  status === API_STATUS.STOPPED ||
  status === API_STATUS.DONE ||
  status === API_STATUS.ERROR ||
  status === API_STATUS.PENDING_ERROR

export const CreatePreviews = memo(() => {
  const options = useSelector(pathsArrOptionsSelector)
  const [mimeTypes, setMimeTypes] = useState<MimeTypes[]>([])
  const [folderPath, setFolderPath] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showMessageList, setShowMessageList] = useState(false)
  const [status, setStatus] = useState<API_STATUS>(API_STATUS.DEFAULT)
  const [webSocket, setWebSocket] = useState<ReturnType<typeof initWebSocket> | null>(null)

  const processing = isProcessing(status)

  useEffect(() => {
    const refreshWebSocketInstance = () => {
      webSocket?.close()
      setWebSocket(null)
      setStatus(API_STATUS.DEFAULT)
    }

    isStopped(status) && refreshWebSocketInstance()
  })

  const handleFolderChange = (currentFolderPath: string) => {
    setFolderPath(currentFolderPath)
  }

  const handleFileTypesChange = (value: MimeTypes[]) => {
    setMimeTypes(value)
  }

  const handleFilterOption = (inputValue: string, option: { value: string } | undefined) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

  const handleProcess = () => {
    processing ? stopProcess() : startProcess()
  }

  const stopProcess = () => {
    webSocket &&
      webSocket.send({
        action: WEB_SOCKET_ACTIONS.CREATE_PREVIEWS_STOP,
      })
  }

  const startProcess = () => {
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

    const ws = initWebSocket(WEB_SOCKET_ACTIONS.CREATE_PREVIEWS, { onMessage, data: { folderPath, mimeTypes } })
    setWebSocket(ws)
    setStatus(API_STATUS.INIT)
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
