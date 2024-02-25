/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Progress } from 'antd'

import { fetchFileTests } from 'src/redux/reducers/testsSlice/thunks'

import { refreshFirstTestPid } from '../../../../../redux/reducers/testsSlice/testsSlice'
import { numberOfFilesChecking } from '../../../../../redux/selectors'
import { useAppDispatch } from '../../../../../redux/store/store'
import TableCollapse from '../../gridItems/TableCollaps'
import TableRow from '../../gridItems/TableRow'

import styles from './index.module.scss'

const MatchingNumberOfFiles = () => {
  const dispatch = useAppDispatch()
  const {
    progress,
    foldersInConfig,
    foldersInDBFiles,
    foldersInDirectory,
    filesInDB,
    filesInDirectory,
    excessiveFolders__Config_DB,
    excessiveFolders__Config_Disk,
    excessiveFolders__DB_Config,
    excessiveFolders__DB_Disk,
    excessiveFolders__Disk_Config,
    excessiveFolders__Disk_DB,
    excessiveFiles__DB_Disk,
    excessiveFiles__Disk_DB,
  } = useSelector(numberOfFilesChecking)

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

  const handleCheckNumberOfFiles = useCallback(() => {
    dispatch(refreshFirstTestPid())
    dispatch(fetchFileTests())
  }, [dispatch])

  return (
    <Card
      className={styles.card}
      title="Test for matching the number of files"
      bordered={false}
      extra={(
        <Button type="primary" ghost onClick={handleCheckNumberOfFiles}>
          Start test
        </Button>
      )}
    >
      <Progress className={styles.progressBar} percent={progress} />

      <TableRow title="Folders in config:" value={foldersInConfig} action={setAction} />
      {showExcessiveFolders_config && (
        <>
          <TableCollapse title="Excessive folders in config - DB" value={excessiveFolders__Config_DB} />
          <TableCollapse title="Excessive folders in config - Disk" value={excessiveFolders__Config_Disk} />
        </>
      )}

      <TableRow title="Folders retrieved from the database:" value={foldersInDBFiles} action={setAction} />
      {showExcessiveFolders_DB && (
        <>
          <TableCollapse title="Excessive folders in DB - Config" value={excessiveFolders__DB_Config} />
          <TableCollapse title="Excessive folders in DB - Disk" value={excessiveFolders__DB_Disk} />
        </>
      )}

      <TableRow title="Folders in disk directories:" value={foldersInDirectory} action={setAction} />
      {showExcessiveFolders_Disk && (
        <>
          <TableCollapse title="Excessive folders in Disk - Config" value={excessiveFolders__Disk_Config} />
          <TableCollapse title="Excessive folders in Disk - DB" value={excessiveFolders__Disk_DB} />
        </>
      )}

      <TableRow title="Files in database:" value={filesInDB} action={setAction} />
      {showExcessiveFiles_DB && <TableCollapse title="Excessive files in DB - Disk" value={excessiveFiles__DB_Disk} />}
      <TableRow title="Files in directory:" value={filesInDirectory} action={setAction} />
      {showExcessiveFiles_Disk && (
        <TableCollapse title="Excessive files in Disk - DB" value={excessiveFiles__Disk_DB} />
      )}
    </Card>
  )
}

export default MatchingNumberOfFiles
