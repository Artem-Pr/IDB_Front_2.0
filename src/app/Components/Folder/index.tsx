import React from 'react'

import { AutoComplete } from 'antd'

import { useDispatch, useSelector } from 'react-redux'

import { FolderTree } from '../index'
import styles from './index.module.scss'

import { currentFolderPath } from '../../../redux/selectors'
import { setCurrentFolderPath } from '../../../redux/reducers/foldersSlice-reducer'

const Folder = () => {
  const initialOptions = [{ value: '/' }, { value: '/folder1/Bom-bom' }, { value: '/folder2/Bom/sdf' }]
  const dispatch = useDispatch()
  const folderPath = useSelector(currentFolderPath)

  const onChange = (data: string) => {
    dispatch(setCurrentFolderPath(data))
  }

  return (
    <>
      <FolderTree />
      <div className="d-flex align-items-center">
        <span className={styles.label}>Directory:</span>
        <AutoComplete
          className="flex-1"
          options={initialOptions}
          defaultValue={folderPath}
          value={folderPath}
          onChange={onChange}
          filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        />
      </div>
    </>
  )
}

export default Folder
