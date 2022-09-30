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
  setCurrentFolderPath,
  setFolderTree,
  setPathsArr,
  setShowSubfolders,
} from '../../../redux/reducers/foldersSlice-reducer'
import { addFolderToFolderTree } from '../../common/folderTree'
import { removeExtraSlash } from '../../common/utils'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'

interface Props {
  isMainPage: boolean
}

const Folders = ({ isMainPage }: Props) => {
  const dispatch = useDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const { folderTree } = useSelector(folderElement)
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
      <Checkbox className={styles.showSubfolders} checked={showSubfolders} onChange={handleShowSubfoldersChange}>
        Show subfolders
      </Checkbox>
      {contextHolder}
    </div>
  )
}

export default Folders
