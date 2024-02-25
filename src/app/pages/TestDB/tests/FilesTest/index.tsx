/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from 'react'

import {
  Button, Card, List, Progress,
} from 'antd'

import { initWebSocket } from '../../../../../api/api-websocket'
import type { FilesTestAPIData } from '../../../../../api/api-websocket'
import { ApiStatus, WebSocketActions, WebSocketAPICallback } from '../../../../../api/types'
import TableCollapse from '../../gridItems/TableCollaps'
import TableRow from '../../gridItems/TableRow'

import styles from './index.module.scss'

const MESSAGE_LIST_LIMIT = 1000
const isStopped = (status: ApiStatus) => status === ApiStatus.STOPPED
  || status === ApiStatus.DONE
  || status === ApiStatus.ERROR
  || status === ApiStatus.PENDING_ERROR

export const FilesTest = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<ApiStatus>(ApiStatus.DEFAULT)
  const [webSocket, setWebSocket] = useState<ReturnType<typeof initWebSocket> | null>(null)
  const [testData, setTestData] = useState<FilesTestAPIData>()
  const [showExcessiveFolders_config, setShowExcessiveFolders_config] = useState(false)
  const [showExcessiveFolders_DB, setShowExcessiveFolders_DB] = useState(false)
  const [showExcessiveFolders_Disk, setShowExcessiveFolders_Disk] = useState(false)
  const [showExcessiveFiles_DB, setShowExcessiveFiles_DB] = useState(false)
  const [showExcessiveFiles_Disk, setShowExcessiveFiles_Disk] = useState(false)

  const setAction = (type: string) => {
    switch (type) {
      case 'Folders in config:':
        return setShowExcessiveFolders_config(!showExcessiveFolders_config)
      case 'Folders retrieved from the database:':
        return setShowExcessiveFolders_DB(!showExcessiveFolders_DB)
      case 'Folders in disk directories:':
        return setShowExcessiveFolders_Disk(!showExcessiveFolders_Disk)
      case 'Files in database:':
        return setShowExcessiveFiles_DB(!showExcessiveFiles_DB)
      case 'Files in directory:':
        return setShowExcessiveFiles_Disk(!showExcessiveFiles_Disk)
      default:
        return null
    }
  }

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

    const onMessage = ({
      message, progress: newProgress, status: newStatus, data,
    }: WebSocketAPICallback<FilesTestAPIData>) => {
      setMessages(prevMessages => [
        message,
        ...(prevMessages.length === MESSAGE_LIST_LIMIT ? prevMessages.slice(0, -1) : prevMessages),
      ])
      setTestData(data)
      setProgress(newProgress)
      setStatus(newStatus)
    }

    const ws = initWebSocket(WebSocketActions.FILES_TEST, { onMessage, onError: refreshWebSocketInstance })
    setWebSocket(ws)
    setStatus(ApiStatus.INIT)
  }

  return (
    <Card
      className={styles.card}
      title="Test for matching the number of files"
      bordered={false}
      extra={(
        <Button type="primary" ghost onClick={handleProcessStart}>
          Start test
        </Button>
      )}
    >
      <span className="margin-left-10 margin-top-10 d-block">{messages[0]}</span>
      <Progress className={styles.progressBar} percent={progress} />

      <TableRow title="Folders in config:" value={testData?.configFoldersCount ?? 'none'} action={setAction} />
      {showExcessiveFolders_config && (
        <>
          <TableCollapse title="Excessive folders in config - DB" value={testData?.excessiveFolders__Config_DB} />
          <TableCollapse title="Excessive folders in config - Disc" value={testData?.excessiveFolders__Config_Disk} />
        </>
      )}

      <TableRow
        title="Folders retrieved from the database:"
        value={testData?.DBFoldersCount ?? 'none'}
        action={setAction}
      />
      {showExcessiveFolders_DB && (
        <>
          <TableCollapse title="Excessive folders in DB - Config" value={testData?.excessiveFolders__DB_Config} />
          <TableCollapse title="Excessive folders in DB - Disc" value={testData?.excessiveFolders__DB_Disc} />
        </>
      )}

      <TableRow title="Folders in disk directories:" value={testData?.DiscFoldersCount ?? 'none'} action={setAction} />
      {showExcessiveFolders_Disk && (
        <>
          <TableCollapse title="Excessive folders in Disk - Config" value={testData?.excessiveFolders__Disk_Config} />
          <TableCollapse title="Excessive folders in Disk - DB" value={testData?.excessiveFolders__Disc_DB} />
        </>
      )}

      <TableRow title="Files in database:" value={testData?.filesInDB ?? 'none'} action={setAction} />
      {showExcessiveFiles_DB && (
        <TableCollapse title="Excessive files in DB - Disk" value={testData?.excessiveFolders__filesInDB} />
      )}
      <TableRow title="Files in directory:" value={testData?.filesOnDisc ?? 'none'} action={setAction} />
      {showExcessiveFiles_Disk && (
        <TableCollapse title="Excessive files in Disk - DB" value={testData?.excessiveFolders__filesOnDisc} />
      )}

      <br />
      {Boolean(messages.length) && (
        <List
          className={styles.progress}
          size="small"
          dataSource={messages}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      )}
    </Card>
  )
}
