import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AutoComplete, Button, Card } from 'antd'

import { pathsArrOptionsSelector } from '../../../../../redux/selectors'

import styles from './index.module.scss'

const CheckFilesWithSameNames = () => {
  const pathsListOptions = useSelector(pathsArrOptionsSelector)
  const [currentFilePath, setCurrentFilePath] = useState('')

  return (
    <Card
      title="Check for files with the same name"
      bordered={false}
      extra={(
        <Button type="primary" href={`/main?comparison=true&folder=${currentFilePath}`} ghost>
          Start test
        </Button>
      )}
    >
      <AutoComplete
        className={styles.autoComplete}
        placeholder="Edit file path"
        options={pathsListOptions}
        defaultValue={currentFilePath}
        onChange={(value: string) => setCurrentFilePath(value)}
        filterOption={(inputValue, option) => option?.value.toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1}
      />
    </Card>
  )
}

export default CheckFilesWithSameNames
