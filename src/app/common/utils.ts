import { FolderTreeItem } from '../../redux/types'

export const getFolderPathFromTreeKey = (key: string, tree: FolderTreeItem[]): string => {
  const getFoundElementPath = (targetKey: string, { children, title }: FolderTreeItem): string =>
    !children ? title : `${title}/${getFolderPathFromTreeKey(targetKey, children)}`

  const foundItem = tree.find(item => key.startsWith(item.key))
  return foundItem ? getFoundElementPath(key, foundItem) : ''
}
