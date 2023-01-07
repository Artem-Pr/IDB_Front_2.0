import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Card, Progress } from 'antd'

import styles from './index.module.scss'
import TableRow from '../../gridItems/TableRow'
import { videoFilesChecking } from '../../../../../redux/selectors'
import { fetchVideoFileTests, refreshSecondTestPid } from '../../../../../redux/reducers/testsSlice-reducer'
import TableCollapse from '../../gridItems/TableCollaps'
import { useAppDispatch } from '../../../../../redux/store/store'

const MatchingVideoFiles = () => {
  const dispatch = useAppDispatch()
  const {
    progress,
    videoInDB,
    videoOnDisk,
    videoThumbnailsOnDisk,
    videoThumbnailsInDB,
    excessiveVideo__Disk_DB,
    excessiveVideo__Disk_DiskThumbnails,
    excessiveVideo__DB_Disk,
    excessiveVideo__DB_DBThumbnails,
    excessiveVideo__DiskThumbnails_Disk,
    excessiveVideo__DiskThumbnails_DBThumbnails,
    excessiveVideo__DBThumbnails_DB,
    excessiveVideo__DBThumbnails_DiskThumbnails,
  } = useSelector(videoFilesChecking)

  const [showExcessiveVideoOnDisk, setShowExcessiveVideoOnDisk] = useState(false)
  const [showExcessiveVideoInDB, setShowExcessiveVideoInDB] = useState(false)
  const [showExcessiveVideoThumbnailsOnDisk, setShowExcessiveVideoThumbnailsOnDisk] = useState(false)
  const [showExcessiveVideoThumbnailsInDB, setShowExcessiveVideoThumbnailsInDB] = useState(false)

  const setAction = (type: string) => {
    switch (type) {
      case 'Videos on disk:':
        return setShowExcessiveVideoOnDisk(!showExcessiveVideoOnDisk)
      case 'Videos in database:':
        return setShowExcessiveVideoInDB(!showExcessiveVideoInDB)
      case 'Video thumbnails on disk:':
        return setShowExcessiveVideoThumbnailsOnDisk(!showExcessiveVideoThumbnailsOnDisk)
      case 'Video thumbnails in database:':
        return setShowExcessiveVideoThumbnailsInDB(!showExcessiveVideoThumbnailsInDB)
      default:
        return null
    }
  }

  const handleCheckVideoFiles = useCallback(() => {
    dispatch(refreshSecondTestPid())
    dispatch(fetchVideoFileTests())
  }, [dispatch])

  return (
    <Card
      className={styles.card}
      title="Test for matching video files"
      bordered={false}
      extra={
        <Button type="primary" ghost onClick={handleCheckVideoFiles}>
          Start test
        </Button>
      }
    >
      <Progress className={styles.progressBar} percent={progress} />

      <TableRow title="Videos on disk:" value={videoOnDisk} action={setAction} />
      {showExcessiveVideoOnDisk && (
        <>
          <TableCollapse title="Excessive videos on disk - DB" value={excessiveVideo__Disk_DB} />
          <TableCollapse
            title="Excessive videos on disk - disk thumbnails"
            value={excessiveVideo__Disk_DiskThumbnails}
          />
        </>
      )}

      <TableRow title="Videos in database:" value={videoInDB} action={setAction} />
      {showExcessiveVideoInDB && (
        <>
          <TableCollapse title="Excessive videos on DB - disk" value={excessiveVideo__DB_Disk} />
          <TableCollapse title="Excessive videos on DB - DB thumbnails" value={excessiveVideo__DB_DBThumbnails} />
        </>
      )}

      <TableRow title="Video thumbnails on disk:" value={videoThumbnailsOnDisk} action={setAction} />
      {showExcessiveVideoThumbnailsOnDisk && (
        <>
          <TableCollapse
            title="Excessive video thumbnails on disk - disk"
            value={excessiveVideo__DiskThumbnails_Disk}
          />
          <TableCollapse
            title="Excessive video thumbnails on disk - DB thumbnails"
            value={excessiveVideo__DiskThumbnails_DBThumbnails}
          />
        </>
      )}

      <TableRow title="Video thumbnails in database:" value={videoThumbnailsInDB} action={setAction} />
      {showExcessiveVideoThumbnailsInDB && (
        <>
          <TableCollapse title="Excessive video thumbnails in DB - DB files" value={excessiveVideo__DBThumbnails_DB} />
          <TableCollapse
            title="Excessive video thumbnails in DB - Disk thumbnails"
            value={excessiveVideo__DBThumbnails_DiskThumbnails}
          />
        </>
      )}
    </Card>
  )
}

export default MatchingVideoFiles
