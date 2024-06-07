import React, { Key, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Tree } from 'antd'
import { compose, curry } from 'ramda'

import { getFolderPathFromTreeKey } from 'src/app/common/folderTree'
import {
  setCurrentFolderKey,
  setCurrentFolderPath,
  setExpandedKeys,
} from 'src/redux/reducers/foldersSlice/foldersSlice'
import { setGalleryPagination } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { curFolderInfo, folderElement } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'

const { DirectoryTree } = Tree

interface Props {
  isMainPage: boolean
  autoExpandParent: boolean
  setAutoExpandParent: (autoExpandParent: boolean) => void
}

export const FolderTree = ({ isMainPage, autoExpandParent, setAutoExpandParent }: Props) => {
  const dispatch = useAppDispatch()
  const { folderTree } = useSelector(folderElement)
  const { currentFolderKey, expandedKeys } = useSelector(curFolderInfo)

  const mainPageTreeProps = useMemo(
    () => (isMainPage
      ? {
        selectedKeys: [currentFolderKey],
        expandedKeys,
        defaultExpandedKeys: expandedKeys,
      }
      : undefined),
    [currentFolderKey, expandedKeys, isMainPage],
  )

  const handleSelect = ([key]: Key[]) => {
    const strKey = String(key)

    const updateMainPage = () => {
      compose(dispatch, setCurrentFolderKey)(strKey)
      compose(dispatch, setGalleryPagination)({ currentPage: 1 })
      dispatch(fetchPhotos())
    }

    const getFolderPathFromTree = curry(getFolderPathFromTreeKey)(folderTree)
    dispatch(setCurrentFolderPath(getFolderPathFromTree(strKey)))
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
