import React, { useMemo } from 'react'

import { AutoComplete, Button, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux'

import { FolderTree } from '../index'
import styles from './index.module.scss'

import { currentFolderPath, folderTree, pathsArr, pathsArrOptions } from '../../../redux/selectors'
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../../redux/reducers/foldersSlice-reducer'
import { addFolderToFolderTree } from '../../common/folderTree'
import { removeExtraSlash } from '../../common/utils'

const Folders = () => {
  const dispatch = useDispatch()
  const tree = useSelector(folderTree)
  const folderPath = useSelector(currentFolderPath)
  const directoriesArr = useSelector(pathsArr)
  const options = useSelector(pathsArrOptions)

  const cleanFolderPath = useMemo(() => removeExtraSlash(folderPath), [folderPath])
  const isButtonAddDisabled = useMemo(() => directoriesArr.includes(cleanFolderPath), [cleanFolderPath, directoriesArr])

  const onChange = (data: string) => {
    dispatch(setCurrentFolderPath(data))
  }

  const setNewFolder = (): void => {
    dispatch(setPathsArr([...directoriesArr, cleanFolderPath]))
    dispatch(setFolderTree(addFolderToFolderTree(cleanFolderPath, tree)))
  }

  const handleAddClick = () => {
    folderPath !== '' && setNewFolder()
  }

  return (
    <div className={styles.folderWrapper}>
      <FolderTree />
      <div className="d-flex align-items-center">
        <span className={styles.label}>Directory:</span>
        <AutoComplete
          className="flex-1"
          options={options}
          defaultValue={folderPath}
          value={folderPath}
          onChange={onChange}
          filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        />
        <Tooltip title="add Directory" className={styles.plusIcon}>
          <Button
            onClick={handleAddClick}
            disabled={isButtonAddDisabled}
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Folders
