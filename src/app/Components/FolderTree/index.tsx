import React, { Key } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tree } from 'antd'
import { compose, curry } from 'ramda'

import { setCurrentFolderPath } from '../../../redux/reducers/foldersSlice-reducer'
import { getFolderPathFromTreeKey } from '../../common/folderTree'
import { folderElement } from '../../../redux/selectors'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice-reducer'

const { DirectoryTree } = Tree

interface Props {
  isMainPage: boolean
}

const FolderTree = ({ isMainPage }: Props) => {
  const { folderTree } = useSelector(folderElement)
  const dispatch = useDispatch()

  const onSelect = (keys: Key[]) => {
    const getFolderPathFromTree = curry(getFolderPathFromTreeKey)(folderTree)
    compose(dispatch, setCurrentFolderPath, getFolderPathFromTree)(keys[0].toString())
    isMainPage && dispatch(fetchPhotos())
  }

  return <DirectoryTree onSelect={onSelect} treeData={folderTree} />
}

export default FolderTree
