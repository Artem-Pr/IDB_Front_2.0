import { flatten, reduce, uniq } from 'ramda'

import type { Media } from 'src/api/models/media'
import { FolderTreeItem } from 'src/redux/types'

import {
  copyByJSON, getFilePathWithoutName, removeExtraSlash, sanitizeDirectory,
} from './utils'

type KeyType = 'parent' | 'sibling'

export const createKeyForFolderTree = (type: KeyType, key: string): string => {
  const getKeyFromParent = () => `${key}-0`
  const getKeyFromSibling = () => {
    const keyArr = key.split('-')
    return `${keyArr.slice(0, -1)
      .join('-')}-${+keyArr.slice(-1) + 1}`
  }
  return type === 'parent' ? getKeyFromParent() : getKeyFromSibling()
}
export const addChildToTreeElem = ({ title, key }: FolderTreeItem, childTitle: string): FolderTreeItem => ({ title, key, children: [{ title: childTitle, key: createKeyForFolderTree('parent', key) }] })
export const addSiblingToTree = (title: string, tree: FolderTreeItem[]): FolderTreeItem[] => {
  const treeItem = { title, key: createKeyForFolderTree('sibling', tree.slice(-1)[0].key) }
  return [...copyByJSON(tree), treeItem]
}
export const createChildrenIfNeeded = (foundItem: FolderTreeItem, titlesArr: string[]): FolderTreeItem => {
  const needCreateChildren = !foundItem.children && titlesArr.length > 1 && foundItem.title === titlesArr[0]
  return needCreateChildren ? addChildToTreeElem(foundItem, titlesArr[1]) : foundItem
}
export const addSiblingIfNeeded = (tree: FolderTreeItem[], titlesArr: string[]): FolderTreeItem[] => {
  const isFoundItem = tree.some(({ title }) => title === titlesArr[0])
  return isFoundItem || titlesArr.length === 0 ? tree : addSiblingToTree(titlesArr[0], tree)
}

const createBasicTree = (title: string): FolderTreeItem[] => [{ title, key: '0-0' }]

export const addFolderToFolderTree = (folderPath: string, tree: FolderTreeItem[]): FolderTreeItem[] => {
  const getNewFolderTree = (titlesArr: string[], subTree: FolderTreeItem[]): FolderTreeItem[] => {
    const subTreeWithNewSiblings = addSiblingIfNeeded(subTree, titlesArr)
    return subTreeWithNewSiblings.map(item => {
      const { title, key, children } = createChildrenIfNeeded(item, titlesArr)
      return titlesArr.length > 1 && item.title === titlesArr[0]
        ? { title, key, children: getNewFolderTree(titlesArr.slice(1), children || []) }
        : item
    })
  }
  const titlesArr = folderPath.split('/')
  return getNewFolderTree(titlesArr, tree.length ? tree : createBasicTree(titlesArr[0]))
}

export const getFolderPathFromTreeKey = (tree: FolderTreeItem[], key: string): string => {
  const getFoundElementPath = (targetKey: string, { children, title }: FolderTreeItem): string => (
    !children ? title : `${title}/${getFolderPathFromTreeKey(children, targetKey)}`
  )

  const foundItem = tree.find(item => key === item.key || key.startsWith(`${item.key}-`))
  const result = foundItem ? getFoundElementPath(key, foundItem) : ''
  return removeExtraSlash(result)
}

const updateFolderTree = (folderTree: FolderTreeItem[], path: string) => {
  const cleanFolderPath = removeExtraSlash(path)
  return addFolderToFolderTree(cleanFolderPath, folderTree)
}

export const createFolderTree = (paths: string[]) => reduce(updateFolderTree, [], paths)

export const expandedSearchingTreeKeysParents = (
  tree: FolderTreeItem[],
  searchedTitle: string,
  parentElem?: FolderTreeItem,
): string[] => flatten(
  tree.map(treeItem => {
    const childrenKeys: string[] = (
      (treeItem.children && expandedSearchingTreeKeysParents(treeItem.children, searchedTitle, treeItem)) || []
    )
    const isTitleMatched = treeItem.title.includes(searchedTitle)
    const parentKey = isTitleMatched ? [parentElem?.key || ''] : []

    return [...parentKey, ...childrenKeys]
  }),
)
  .filter(Boolean)

interface ExpandedTreeKeyFromPath {
  parentKeys: string[]
  elementKey: string
}

export const expandedTreeKeyFromPath = (
  tree: FolderTreeItem[],
  treePath: string,
  parentElem?: FolderTreeItem,
): ExpandedTreeKeyFromPath => {
  const folderNamesArr = treePath.split('/')
  const currentTreeNode = tree.find(({ title }) => title === folderNamesArr[0])
  const childrenTreePath = folderNamesArr.slice(1)
    .join('/')
  const childrenTree = currentTreeNode?.children

  return childrenTree && childrenTreePath
    ? expandedTreeKeyFromPath(childrenTree, childrenTreePath, currentTreeNode)
    : {
      parentKeys: [parentElem?.key || ''],
      elementKey: currentTreeNode?.key || '',
    }
}

export const getExpandedTreeKeys = (tree: FolderTreeItem[], treePath: string): ExpandedTreeKeyFromPath => {
  const folderNamesArrLength = treePath.split('/').length
  const needToOpenDifferentParents = folderNamesArrLength === 1
  const result = needToOpenDifferentParents
    ? {
      parentKeys: expandedSearchingTreeKeysParents(tree, treePath),
      elementKey: '',
    }
    : expandedTreeKeyFromPath(tree, treePath)

  return { ...result, parentKeys: result.parentKeys.filter(Boolean) }
}

export const getDirAndSubfolders = (directory: string): string[] => sanitizeDirectory(directory)
  .split('/')
  .filter(Boolean)
  .reduce<string[]>((accum, currentDir) => {
  if (!accum.length) return [currentDir]
  return [...accum, `${accum.at(-1)}/${currentDir}`]
}, [])

export const addNewPathToPathsArr = (pathsArr: string[], newPath: string): string[] => {
  const newFolderWithSubDirectories = getDirAndSubfolders(newPath)
  return uniq([...pathsArr, ...newFolderWithSubDirectories])
}

export const getUpdatedPathsArrFromMediaList = (mediaList: Media[], actualPathsArr: string[]) => mediaList
  .filter((media): media is Media & { filePath: string } => Boolean(media.filePath))
  .map(({ filePath }) => getFilePathWithoutName(filePath))
  .reduce<string[]>((accum, currentPath) => addNewPathToPathsArr(accum, currentPath), actualPathsArr)
