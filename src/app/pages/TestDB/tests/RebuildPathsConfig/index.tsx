import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Progress } from 'antd'

import { setThirdTestProgress } from 'src/redux/reducers/testsSlice/testsSlice'
import { rebuildPathsConfig } from 'src/redux/reducers/testsSlice/thunks/rebuildPathsConfig'
import { pathsConfigRebuildProgress } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import TableRow from '../../gridItems/TableRow'

import styles from './index.module.scss'

const RebuildPathsConfig = () => {
  const dispatch = useAppDispatch()
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
      extra={(
        <Button type="primary" ghost onClick={handleClick}>
          Start test
        </Button>
      )}
    >
      <Progress className={styles.progressBar} percent={progress} />

      <TableRow title="Rebuild status:" value={progress === 100 ? 'SUCCESS' : progress} />
    </Card>
  )
}

export default RebuildPathsConfig
