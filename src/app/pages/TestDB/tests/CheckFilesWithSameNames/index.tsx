import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { AutoComplete, Button, Card } from 'antd'

import { getFolderReducerPathsArrOptionsSelector } from 'src/redux/reducers/foldersSlice/selectors'

import styles from './index.module.scss'

const CheckFilesWithSameNames = () => {
  const pathsListOptions = useSelector(getFolderReducerPathsArrOptionsSelector)
  const [currentFilePath, setCurrentFilePath] = useState('')

  return (
    <Card
      title="Check for files with the same name"
      variant="borderless"
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
