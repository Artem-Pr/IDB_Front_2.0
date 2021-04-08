import React, { Key } from 'react'
import { Tree } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { folderTree } from '../../../redux/selectors'
import { setCurrentFolderPath } from '../../../redux/reducers/foldersSlice-reducer'
import { getFolderPathFromTreeKey } from '../../common/utils'

const { DirectoryTree } = Tree

const FolderTree = () => {
  const treeData = useSelector(folderTree)
  const dispatch = useDispatch()

  const onSelect = (keys: Key[]) => {
    dispatch(setCurrentFolderPath(getFolderPathFromTreeKey(keys[0].toString(), treeData)))
  }

  return <DirectoryTree defaultExpandAll onSelect={onSelect} treeData={treeData} />
}

export default FolderTree
