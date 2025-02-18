import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
import {
  AutoComplete, Button, Modal, Checkbox,
} from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import {
  addFolderToFolderTree, addNewPathToPathsArr, getExpandedTreeKeys,
} from 'src/app/common/folderTree'
import { removeExtraSlash } from 'src/app/common/utils'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
  setFolderTree,
  setIsDynamicFolders,
  setPathsArr,
  setShowSubfolders,
} from 'src/redux/reducers/foldersSlice/foldersSlice'
import { fetchPathsList, removeDirectoryIfExists } from 'src/redux/reducers/foldersSlice/thunks'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import {
  folderInfoCurrentFolder,
  folderInfoIsDynamicFolders,
  folderElement,
  pathsArr,
  pathsArrOptionsSelector,
  folderInfoShowSubfolders,
  getIsCurrentPage,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { FolderTree } from './components'

import styles from './Folders.module.scss'

export const Folders = () => {
  const dispatch = useAppDispatch()
  const [modal, contextHolder] = Modal.useModal()
  const { folderTree } = useSelector(folderElement)
  const { isMainPage } = useSelector(getIsCurrentPage)
  const currentFolderPath = useSelector(folderInfoCurrentFolder)
  const showSubfolders = useSelector(folderInfoShowSubfolders)

  const isDynamicFolders = useSelector(folderInfoIsDynamicFolders)
  const directoriesArr = useSelector(pathsArr)
  const options = useSelector(pathsArrOptionsSelector)
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const cleanFolderPath = useMemo(() => removeExtraSlash(currentFolderPath), [currentFolderPath])
  const isButtonAddDisabled = useMemo(() => directoriesArr.includes(cleanFolderPath), [cleanFolderPath, directoriesArr])

  const onChange = (newCurrentFolderPath: string) => {
    dispatch(setCurrentFolderPath(newCurrentFolderPath))
  }

  const setNewFolder = () => {
    const updatedPathsArr = addNewPathToPathsArr(directoriesArr, cleanFolderPath)
    dispatch(setPathsArr(updatedPathsArr))
    dispatch(setFolderTree(addFolderToFolderTree(cleanFolderPath, folderTree)))
  }

  const handleAddClick = () => {
    currentFolderPath !== '' && setNewFolder()
  }

  const handleFilterOption = (inputValue: string, option: any) => option?.value.toUpperCase()
    .indexOf(inputValue.toUpperCase()) !== -1

  const handleDeleteClick = () => {
    dispatch(removeDirectoryIfExists(modal.confirm))
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
