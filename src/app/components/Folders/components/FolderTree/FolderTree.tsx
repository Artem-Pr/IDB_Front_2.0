import React, { Key, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Tree } from 'antd'
import { compose, curry } from 'ramda'

import { getFolderPathFromTreeKey } from 'src/app/common/folderTree'
import {
  folderReducerSetCurrentFolderKey,
  folderReducerSetCurrentFolderPath,
  folderReducerSetExpandedKeys,
} from 'src/redux/reducers/foldersSlice'
import { getFolderReducerFolderInfoCurrentFolderKey, getFolderReducerFolderInfoExpandedKeys, getFolderReducerFolderTree } from 'src/redux/reducers/foldersSlice/selectors'
import { mainPageReducerSetGalleryPagination } from 'src/redux/reducers/mainPageSlice'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'

import styles from './FolderTree.module.scss'

const { DirectoryTree } = Tree

interface Props {
  isMainPage: boolean
  autoExpandParent: boolean
  setAutoExpandParent: (autoExpandParent: boolean) => void
}

export const FolderTree = ({ isMainPage, autoExpandParent, setAutoExpandParent }: Props) => {
  const dispatch = useAppDispatch()
  const folderTree = useSelector(getFolderReducerFolderTree)
  const currentFolderKey = useSelector(getFolderReducerFolderInfoCurrentFolderKey)
  const expandedKeys = useSelector(getFolderReducerFolderInfoExpandedKeys)

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
      compose(dispatch, folderReducerSetCurrentFolderKey)(strKey)
      compose(dispatch, mainPageReducerSetGalleryPagination)({ currentPage: 1 })
      dispatch(fetchPhotos())
    }

    const getFolderPathFromTree = curry(getFolderPathFromTreeKey)(folderTree)
    dispatch(folderReducerSetCurrentFolderPath(getFolderPathFromTree(strKey)))
    isMainPage && updateMainPage()
  }

  const handleExpend = (expandedKeysValue: Key[]) => {
    dispatch(folderReducerSetExpandedKeys(expandedKeysValue))
    setAutoExpandParent(false)
  }

  return (
    <DirectoryTree
      {...mainPageTreeProps}
      className={styles.wrapper}
      onSelect={handleSelect}
      onExpand={handleExpend}
      treeData={folderTree}
      autoExpandParent={autoExpandParent}
    />
  )
}
