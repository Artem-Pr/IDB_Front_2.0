import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Progress } from 'antd'

import styles from './index.module.scss'
import TableRow from '../../gridItems/TableRow'
import { pathsConfigRebuildProgress } from '../../../../../redux/selectors'
import { rebuildPathsConfig, setThirdTestProgress } from '../../../../../redux/reducers/testsSlice-reducer'

const RebuildPathsConfig = () => {
  const dispatch = useDispatch()
  const progress = useSelector(pathsConfigRebuildProgress)

  const handleClick = useCallback(() => {
    dispatch(setThirdTestProgress(0))
    dispatch(rebuildPathsConfig())
  }, [dispatch])

  return (
    <Card
      className={styles.card}
      title="Rebuild folders config"
      bordered={false}
      extra={
        <Button type="primary" ghost onClick={handleClick}>
          Start test
        </Button>
      }
    >
      <Progress className={styles.progressBar} percent={progress} />

      <TableRow title="Rebuild status:" value={progress === 100 ? 'SUCCESS' : progress} />
    </Card>
  )
}

export default RebuildPathsConfig
