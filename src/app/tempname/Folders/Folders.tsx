import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import {
  AutoComplete, Button, Modal, Checkbox,
} from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import { checkDirectory, fetchPathsList } from 'src/redux/reducers/foldersSlice/thunks'

import { deleteConfirmation } from '../../../assets/config/moduleConfig'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setFolderTree,
  setIsDynamicFolders,
  setPathsArr,
  setShowSubfolders,
} from '../../../redux/reducers/foldersSlice/foldersSlice'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'
import {
  curFolderInfo, folderElement, pathsArr, pathsArrOptionsSelector,
} from '../../../redux/selectors'
import { useAppDispatch } from '../../../redux/store/store'
import { addFolderToFolderTree, getExpandedTreeKeys } from '../../common/folderTree'
import { useCurrentPage } from '../../common/hooks'
import { removeExtraSlash } from '../../common/utils'

import { FolderTree } from './components'

import styles from './Folders.module.scss'

export const Folders = () => {
  const dispatch = useAppDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const { folderTree } = useSelector(folderElement)
  const { isMainPage } = useCurrentPage()
  const { currentFolderPath, showSubfolders, isDynamicFolders } = useSelector(curFolderInfo)
  const directoriesArr = useSelector(pathsArr)
  const options = useSelector(pathsArrOptionsSelector)
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const cleanFolderPath = useMemo(() => removeExtraSlash(currentFolderPath), [currentFolderPath])
  const isButtonAddDisabled = useMemo(() => directoriesArr.includes(cleanFolderPath), [cleanFolderPath, directoriesArr])

  const onChange = (newCurrentFolderPath: string) => {
    dispatch(setCurrentFolderPath(newCurrentFolderPath))
  }

  const setNewFolder = () => {
    dispatch(setPathsArr([...directoriesArr, cleanFolderPath]))
    dispatch(setFolderTree(addFolderToFolderTree(cleanFolderPath, folderTree)))
  }

  const handleAddClick = () => {
    currentFolderPath !== '' && setNewFolder()
  }

  const handleFilterOption = (inputValue: string, option: any) => option?.value.toUpperCase()
    .indexOf(inputValue.toUpperCase()) !== -1

  const handleDeleteClick = () => {
    const onOk = () => {
      dispatch(checkDirectory())
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'directory' }))
  }

  const handleShowSubfoldersChange = (e: CheckboxChangeEvent) => {
    dispatch(setShowSubfolders(e.target.checked))
  }

  const handleDynamicFolderClick = (e: CheckboxChangeEvent) => {
    dispatch(setIsDynamicFolders(e.target.checked))
    !e.target.checked && dispatch(fetchPathsList())
  }

  const handleReset = () => {
    dispatch(setCurrentFolderPath(''))
    dispatch(setCurrentFolderKey(''))
    dispatch(fetchPhotos())
  }

  const handleFolderExpand = () => {
    const { parentKeys, elementKey } = getExpandedTreeKeys(folderTree, currentFolderPath)
    parentKeys
      && dispatch(setExpandedKeys(parentKeys))
      && dispatch(setCurrentFolderPath(currentFolderPath))
      && setAutoExpandParent(true)

    dispatch(setCurrentFolderKey(elementKey))
  }

  return (
    <div className={styles.folderWrapper}>
      <FolderTree
        isMainPage={isMainPage}
        autoExpandParent={autoExpandParent}
        setAutoExpandParent={setAutoExpandParent}
      />
      <div className="d-flex align-items-center margin-top-10 gap-10">
        <span>Directory:</span>
        <AutoComplete
          className="flex-1"
          placeholder="write folder name"
          options={options}
          defaultValue={currentFolderPath}
          value={currentFolderPath}
          onChange={onChange}
          filterOption={handleFilterOption}
        />
      </div>

      <div className="d-flex margin-top-10 gap-10 justify-content-end">
        <Button
          onClick={handleDeleteClick}
          disabled={!isButtonAddDisabled}
          type="primary"
          icon={<DeleteOutlined />}
          danger
        >
          Delete
        </Button>

        <Button onClick={handleAddClick} disabled={isButtonAddDisabled} type="primary" icon={<PlusOutlined />}>
          Add
        </Button>

        {isMainPage && (
          <Button onClick={handleFolderExpand} type="primary" icon={<FolderOpenOutlined />}>
            Expand
          </Button>
        )}
      </div>

      <div className="d-flex justify-content-between margin-top-10">
        <div className="d-flex flex-column">
          <Checkbox className={styles.showSubfolders} checked={showSubfolders} onChange={handleShowSubfoldersChange}>
            Show subfolders
          </Checkbox>
          <Checkbox className={styles.showSubfolders} checked={isDynamicFolders} onChange={handleDynamicFolderClick}>
            Dynamic folders
          </Checkbox>
        </div>

        <Button onClick={handleReset}>Reset</Button>
      </div>
      {contextHolder}
    </div>
  )
}
