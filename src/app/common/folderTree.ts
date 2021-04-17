import { FolderTreeItem } from '../../redux/types'
import { copyByJSON, removeExtraSlash } from './utils'

type KeyType = 'parent' | 'sibling'

export const createKeyForFolderTree = (type: KeyType, key: string): string => {
  const getKeyFromParent = () => key + '-0'
  const getKeyFromSibling = () => {
    const keyArr = key.split('-')
    return `${keyArr.slice(0, -1).join('-')}-${+keyArr.slice(-1) + 1}`
  }
  return type === 'parent' ? getKeyFromParent() : getKeyFromSibling()
}
export const addChildToTreeElem = ({ title, key }: FolderTreeItem, childTitle: string): FolderTreeItem => {
  return { title, key, children: [{ title: childTitle, key: createKeyForFolderTree('parent', key) }] }
}
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

const createBasicTree = (title: string): FolderTreeItem[] => {
  return [{ title, key: '0-0' }]
}

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

export const getFolderPathFromTreeKey = (key: string, tree: FolderTreeItem[]): string => {
  const getFoundElementPath = (targetKey: string, { children, title }: FolderTreeItem): string =>
    !children ? title : `${title}/${getFolderPathFromTreeKey(targetKey, children)}`

  const foundItem = tree.find(item => key.startsWith(item.key))
  const result = foundItem ? getFoundElementPath(key, foundItem) : ''
  return removeExtraSlash(result)
}
