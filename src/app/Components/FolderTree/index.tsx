import React, { Key, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tree } from 'antd'
import { compose, curry } from 'ramda'

import { setCurrentFolderKey, setCurrentFolderPath } from '../../../redux/reducers/foldersSlice-reducer'
import { getFolderPathFromTreeKey } from '../../common/folderTree'
import { curFolderInfo, folderElement } from '../../../redux/selectors'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'

const { DirectoryTree } = Tree

interface Props {
  isMainPage: boolean
}

const FolderTree = ({ isMainPage }: Props) => {
  const { folderTree } = useSelector(folderElement)
  const { currentFolderKey } = useSelector(curFolderInfo)
  const dispatch = useDispatch()

  const mainPageTreeProps = useMemo(
    () =>
      isMainPage
        ? {
            selectedKeys: [currentFolderKey],
            defaultExpandedKeys: [currentFolderKey],
          }
        : undefined,
    [currentFolderKey, isMainPage]
  )

  const onSelect = ([key]: Key[]) => {
    const getFolderPathFromTree = curry(getFolderPathFromTreeKey)(folderTree)
    compose(dispatch, setCurrentFolderPath, getFolderPathFromTree)(String(key))
    isMainPage && compose(dispatch, setCurrentFolderKey)(String(key))
    isMainPage && dispatch(fetchPhotos())
  }

  return <DirectoryTree {...mainPageTreeProps} onSelect={onSelect} treeData={folderTree} />
}

export default FolderTree
