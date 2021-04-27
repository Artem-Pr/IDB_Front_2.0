import React, { Key } from 'react'
import { Tree } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { setCurrentFolderPath } from '../../../redux/reducers/foldersSlice-reducer'
import { getFolderPathFromTreeKey } from '../../common/folderTree'
import { folderElement } from '../../../redux/selectors'

const { DirectoryTree } = Tree

const FolderTree = () => {
  const { folderTree } = useSelector(folderElement)
  const dispatch = useDispatch()

  const onSelect = (keys: Key[]) => {
    dispatch(setCurrentFolderPath(getFolderPathFromTreeKey(keys[0].toString(), folderTree)))
  }

  return <DirectoryTree defaultExpandAll onSelect={onSelect} treeData={folderTree} />
}

export default FolderTree
