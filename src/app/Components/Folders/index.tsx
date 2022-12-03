import React, { useMemo } from 'react'

import { AutoComplete, Button, Modal, Tooltip, Checkbox } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux'

import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import { FolderTree } from '../index'
import styles from './index.module.scss'

import { curFolderInfo, folderElement, pathsArr, pathsArrOptionsSelector } from '../../../redux/selectors'
import {
  checkDirectory,
  setCurrentFolderKey,
  setCurrentFolderPath,
  setFolderTree,
  setPathsArr,
  setShowSubfolders,
} from '../../../redux/reducers/foldersSlice-reducer'
import { addFolderToFolderTree } from '../../common/folderTree'
import { removeExtraSlash } from '../../common/utils'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'
import { useCurrentPage } from '../../common/hooks'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'

const Folders = () => {
  const dispatch = useDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const { folderTree } = useSelector(folderElement)
  const { isMainPage } = useCurrentPage()
  const { currentFolderPath, showSubfolders } = useSelector(curFolderInfo)
  const directoriesArr = useSelector(pathsArr)
  const options = useSelector(pathsArrOptionsSelector)

  const cleanFolderPath = useMemo(() => removeExtraSlash(currentFolderPath), [currentFolderPath])
  const isButtonAddDisabled = useMemo(() => directoriesArr.includes(cleanFolderPath), [cleanFolderPath, directoriesArr])

  const onChange = (data: string) => {
    dispatch(setCurrentFolderPath(data))
  }

  const setNewFolder = () => {
    dispatch(setPathsArr([...directoriesArr, cleanFolderPath]))
    dispatch(setFolderTree(addFolderToFolderTree(cleanFolderPath, folderTree)))
  }

  const handleAddClick = () => {
    currentFolderPath !== '' && setNewFolder()
  }

  const handleFilterOption = (inputValue: string, option: any) =>
    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

  const handleDeleteClick = () => {
    const onOk = () => {
      dispatch(checkDirectory())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'directory' }))
  }

  const handleShowSubfoldersChange = (e: CheckboxChangeEvent) => {
    dispatch(setShowSubfolders(e.target.checked))
  }

  const handleReset = () => {
    dispatch(setCurrentFolderPath(''))
    dispatch(setCurrentFolderKey(''))
    dispatch(fetchPhotos())
  }

  return (
    <div className={styles.folderWrapper}>
      <FolderTree isMainPage={isMainPage} />
      <div className="d-flex align-items-center margin-top-10">
        <span className={styles.label}>Directory:</span>
        <AutoComplete
          className="flex-1"
          options={options}
          defaultValue={currentFolderPath}
          value={currentFolderPath}
          onChange={onChange}
          filterOption={handleFilterOption}
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
        <Tooltip title="remove Directory" className={styles.plusIcon}>
          <Button
            onClick={handleDeleteClick}
            disabled={!isButtonAddDisabled}
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      </div>

      <div className="d-flex justify-content-between margin-top-10">
        <Checkbox className={styles.showSubfolders} checked={showSubfolders} onChange={handleShowSubfoldersChange}>
          Show subfolders
        </Checkbox>

        <Button onClick={handleReset}>Reset</Button>
      </div>
      {contextHolder}
    </div>
  )
}

export default Folders
