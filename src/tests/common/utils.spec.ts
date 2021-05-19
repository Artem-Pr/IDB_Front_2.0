import {
  addChildToTreeElem,
  addFolderToFolderTree,
  addSiblingIfNeeded,
  addSiblingToTree,
  createChildrenIfNeeded,
  createKeyForFolderTree,
  getFolderPathFromTreeKey,
} from '../../app/common/folderTree'
import { getNameParts, removeExtraSlash } from '../../app/common/utils'
import {
  foldersSliceFolderTree,
  folderTreeForTest1,
  folderTreeForTest2,
  folderTreeForTest3,
  folderTreeForTest4,
} from './mock'

describe('utils: ', () => {
  it('removeExtraSlash should remove slash at the end of string', () => {
    const value1 = removeExtraSlash('string/')
    const value2 = removeExtraSlash('string/folder/')
    const value3 = removeExtraSlash('string/folder')
    const value4 = removeExtraSlash('string')
    const value5 = removeExtraSlash('')
    expect(value1).toBe('string')
    expect(value2).toBe('string/folder')
    expect(value3).toBe('string/folder')
    expect(value4).toBe('string')
    expect(value5).toBe('')
  })
  it('createKeyForFolderTree should return valid key', () => {
    const key1 = createKeyForFolderTree('parent', '0-0')
    const key2 = createKeyForFolderTree('parent', '0-34-234')
    const key3 = createKeyForFolderTree('sibling', '0-34-234')
    const key4 = createKeyForFolderTree('sibling', '0-0')
    expect(key1).toBe('0-0-0')
    expect(key2).toBe('0-34-234-0')
    expect(key3).toBe('0-34-235')
    expect(key4).toBe('0-1')
  })
  it('addChildToTreeElem should return tree element with child', () => {
    const treeItem = { title: 'leaf 0-1', key: '0-0-1' }
    const treeItemWithChild = addChildToTreeElem(treeItem, 'childFolder')
    const { key, title, children } = treeItemWithChild
    expect(key).toBe('0-0-1')
    expect(title).toBe('leaf 0-1')
    expect(children).toBeDefined()
    expect(children).toHaveLength(1)
    expect(children && children[0].key).toBe('0-0-1-0')
    expect(children && children[0].title).toBe('childFolder')
    expect(children && children[0].children).toBeUndefined()
  })
  it('addSiblingToTree should return tree array with new element', () => {
    const treeWithNewElem = addSiblingToTree('newSibling', foldersSliceFolderTree)
    expect(treeWithNewElem).toHaveLength(3)
    expect(treeWithNewElem[0].title).toBe('main parent')
    expect(treeWithNewElem[1].title).toBe('parent 1')
    expect(treeWithNewElem[2].title).toBe('newSibling')
    expect(treeWithNewElem[2].key).toBe('0-2')
    expect(treeWithNewElem[2].children).toBeUndefined()
  })
  describe('createChildrenIfNeeded: ', () => {
    it('createChildrenIfNeeded should return treeItem element with children', () => {
      const treeItem = { title: 'child', key: '0-0-1' }
      const titlesArr = ['child', 'child2', 'child3']
      const treeWithNewElem = createChildrenIfNeeded(treeItem, titlesArr)
      const { title, key, children } = treeWithNewElem
      expect(title).toBe('child')
      expect(key).toBe('0-0-1')
      expect(children).toBeDefined()
      expect(children && children[0].key).toBe('0-0-1-0')
      expect(children && children[0].title).toBe('child2')
      expect(children && children[0].children).toBeUndefined()
    })
    it('createChildrenIfNeeded should return treeItem element without children if conditions are not matched', () => {
      const treeItem = { title: 'folder', key: '0-0-1' }
      const treeItem2 = { title: 'child', key: '0-0-1' }
      const treeItem3 = { title: 'child', key: '0-0-1', children: [{ title: 'someTitle', key: '0-0-1-0' }] }
      const titlesArr = ['child', 'child2', 'child3']
      const titlesArr2 = ['child']
      const { title, key, children } = createChildrenIfNeeded(treeItem, titlesArr)
      const { title: title2, key: key2, children: children2 } = createChildrenIfNeeded(treeItem2, titlesArr2)
      const { title: title3, key: key3, children: children3 } = createChildrenIfNeeded(treeItem3, titlesArr2)
      expect(title).toBe('folder') // different title
      expect(key).toBe('0-0-1')
      expect(children).toBeUndefined()
      expect(title2).toBe('child') // titlesArr.length === 1
      expect(key2).toBe('0-0-1')
      expect(children2).toBeUndefined()
      expect(title3).toBe('child') // treeItem has a child
      expect(key3).toBe('0-0-1')
      expect(children3).toBeDefined()
      expect(children3 && children3[0].title).toBe('someTitle')
    })
  })
  describe('addSiblingIfNeeded: ', () => {
    it('should add sibling to treeItem element', () => {
      const tree = foldersSliceFolderTree
      const titlesArr = ['child', 'child2', 'child3']
      const treeWithNewElem = addSiblingIfNeeded(tree, titlesArr)
      const { title, key, children } = treeWithNewElem[2]
      expect(title).toBe('child')
      expect(key).toBe('0-2')
      expect(children).toBeUndefined()
    })
    it('should keep old tree if conditions are not matched', () => {
      const tree = foldersSliceFolderTree
      const titlesArr2 = ['parent 1', 'child2', 'child3'] // isFoundItem === true
      const treeWithNewElem2 = addSiblingIfNeeded(tree, titlesArr2)
      expect(treeWithNewElem2).toHaveLength(2)
      expect(treeWithNewElem2 && treeWithNewElem2[1].title).toBe('parent 1')
    })
  })
  describe('addFolderToFolderTree: ', () => {
    it('should add new Folder (Test1 - parent 1/child2)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 1/child2'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest1
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON).toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder (Test2 - parent 2)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 2'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest2
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON).toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder (Test3 - main parent/leaf 0-1/child 1)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'main parent/leaf 0-1/child 1'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest3
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON).toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder when folder tree is empty (Test4 - main parent)', () => {
      const folderPath = 'main parent'
      const updatedTree = addFolderToFolderTree(folderPath, [])
      const snapshot = folderTreeForTest4
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON).toBe(JSON.stringify(snapshot))
    })
    it('should keep old tree if path exists (Test5 - parent 1/leaf 1-0)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 1/leaf 1-0'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON).toBe(JSON.stringify(tree))
    })
  })
  it('getFolderPathFromTreeKey should return valid path', () => {
    const folderPath = getFolderPathFromTreeKey('0-1-0', foldersSliceFolderTree)
    expect(folderPath).toBe('parent 1/leaf 1-0')
  })
  describe('getNameParts: ', () => {
    it('should return right object', () => {
      const fullName = 'myPhoto.jpg'
      const fullName2 = 'myPhoto.bom-bom.bom.jpeg'
      const { shortName, ext } = getNameParts(fullName)
      const { shortName: shortName2, ext: ext2 } = getNameParts(fullName2)
      expect(shortName).toBe('myPhoto')
      expect(shortName2).toBe('myPhoto.bom-bom.bom')
      expect(ext).toBe('.jpg')
      expect(ext2).toBe('.jpeg')
    })
    it('should return empty values if name is not valid', () => {
      const fullName = ''
      const fullName2 = '-'
      const { shortName, ext } = getNameParts(fullName)
      const { shortName: shortName2, ext: ext2 } = getNameParts(fullName2)
      expect(shortName).toBe('-')
      expect(shortName2).toBe('-')
      expect(ext).toBe('')
      expect(ext2).toBe('')
    })
  })
})