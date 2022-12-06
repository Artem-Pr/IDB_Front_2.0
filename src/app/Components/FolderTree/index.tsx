import React, { Key, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tree } from 'antd'
import { compose, curry } from 'ramda'

import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
} from '../../../redux/reducers/foldersSlice-reducer'
import { getFolderPathFromTreeKey } from '../../common/folderTree'
import { curFolderInfo, folderElement } from '../../../redux/selectors'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'
import { setGalleryPagination } from '../../../redux/reducers/mainPageSlice/mainPageSlice'

const { DirectoryTree } = Tree

interface Props {
  isMainPage: boolean
  autoExpandParent: boolean
  setAutoExpandParent: (autoExpandParent: boolean) => void
}

const FolderTree = ({ isMainPage, autoExpandParent, setAutoExpandParent }: Props) => {
  const dispatch = useDispatch()
  const { folderTree } = useSelector(folderElement)
  const { currentFolderKey, expandedKeys } = useSelector(curFolderInfo)

  const mainPageTreeProps = useMemo(
    () =>
      isMainPage
        ? {
            selectedKeys: [currentFolderKey],
            expandedKeys: expandedKeys,
            defaultExpandedKeys: expandedKeys,
          }
        : undefined,
    [currentFolderKey, expandedKeys, isMainPage]
  )

  const handleSelect = ([key]: Key[]) => {
    const strKey = String(key)

    const updateMainPage = () => {
      compose(dispatch, setCurrentFolderKey)(strKey)
      compose(dispatch, setGalleryPagination)({ currentPage: 1 })
      compose(dispatch, fetchPhotos)()
    }

    const getFolderPathFromTree = curry(getFolderPathFromTreeKey)(folderTree)
    compose(dispatch, setCurrentFolderPath, getFolderPathFromTree)(strKey)
    isMainPage && updateMainPage()
  }

  const handleExpend = (expandedKeysValue: Key[]) => {
    dispatch(setExpandedKeys(expandedKeysValue))
    setAutoExpandParent(false)
  }

  return (
    <DirectoryTree
      {...mainPageTreeProps}
      onSelect={handleSelect}
      onExpand={handleExpend}
      treeData={folderTree}
      autoExpandParent={autoExpandParent}
    />
  )
}

export default FolderTree
