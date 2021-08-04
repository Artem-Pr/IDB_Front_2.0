import React, { useMemo } from 'react'

import { AutoComplete, Button, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux'

import { FolderTree } from '../index'
import styles from './index.module.scss'

import { folderElement, pathsArr, pathsArrOptionsSelector } from '../../../redux/selectors'
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../../redux/reducers/foldersSlice-reducer'
import { addFolderToFolderTree } from '../../common/folderTree'
import { removeExtraSlash } from '../../common/utils'

interface Props {
  isMainPage: boolean
}

const Folders = ({ isMainPage }: Props) => {
  const dispatch = useDispatch()
  const { folderTree, currentFolderPath } = useSelector(folderElement)
  const directoriesArr = useSelector(pathsArr)
  const options = useSelector(pathsArrOptionsSelector)

  const cleanFolderPath = useMemo(() => removeExtraSlash(currentFolderPath), [currentFolderPath])
  const isButtonAddDisabled = useMemo(() => directoriesArr.includes(cleanFolderPath), [cleanFolderPath, directoriesArr])

  const onChange = (data: string) => {
    dispatch(setCurrentFolderPath(data))
  }

  const setNewFolder = (): void => {
    dispatch(setPathsArr([...directoriesArr, cleanFolderPath]))
    dispatch(setFolderTree(addFolderToFolderTree(cleanFolderPath, folderTree)))
  }

  const handleAddClick = () => {
    currentFolderPath !== '' && setNewFolder()
  }

  return (
    <div className={styles.folderWrapper}>
      <FolderTree isMainPage={isMainPage} />
      <div className="d-flex align-items-center">
        <span className={styles.label}>Directory:</span>
        <AutoComplete
          className="flex-1"
          options={options}
          defaultValue={currentFolderPath}
          value={currentFolderPath}
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
