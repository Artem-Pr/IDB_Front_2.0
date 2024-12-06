import { Media, MediaInstance } from 'src/api/models/media'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import {
  addChildToTreeElem,
  addFolderToFolderTree,
  addNewPathToPathsArr,
  addSiblingIfNeeded,
  addSiblingToTree,
  createChildrenIfNeeded,
  createKeyForFolderTree,
  expandedSearchingTreeKeysParents,
  expandedTreeKeyFromPath,
  getDirAndSubfolders,
  getExpandedTreeKeys,
  getFolderPathFromTreeKey,
  getUpdatedPathsArrFromMediaList,
} from './folderTree'
import {
  folderTreeForFilteredTreeKeysTest,
  folderTreeForTest1,
  folderTreeForTest2,
  folderTreeForTest3,
  folderTreeForTest4,
  foldersSliceFolderTree,
} from './tests/mock'

describe('folderTree: ', () => {
  it('createKeyForFolderTree should return valid key', () => {
    const key1 = createKeyForFolderTree('parent', '0-0')
    const key2 = createKeyForFolderTree('parent', '0-34-234')
    const key3 = createKeyForFolderTree('sibling', '0-34-234')
    const key4 = createKeyForFolderTree('sibling', '0-0')
    expect(key1)
      .toBe('0-0-0')
    expect(key2)
      .toBe('0-34-234-0')
    expect(key3)
      .toBe('0-34-235')
    expect(key4)
      .toBe('0-1')
  })
  it('addChildToTreeElem should return tree element with child', () => {
    const treeItem = { title: 'leaf 0-1', key: '0-0-1' }
    const treeItemWithChild = addChildToTreeElem(treeItem, 'childFolder')
    const { key, title, children } = treeItemWithChild
    expect(key)
      .toBe('0-0-1')
    expect(title)
      .toBe('leaf 0-1')
    expect(children)
      .toBeDefined()
    expect(children)
      .toHaveLength(1)
    expect(children && children[0].key)
      .toBe('0-0-1-0')
    expect(children && children[0].title)
      .toBe('childFolder')
    expect(children && children[0].children)
      .toBeUndefined()
  })
  it('addSiblingToTree should return tree array with new element', () => {
    const treeWithNewElem = addSiblingToTree('newSibling', foldersSliceFolderTree)
    expect(treeWithNewElem)
      .toHaveLength(3)
    expect(treeWithNewElem[0].title)
      .toBe('main parent')
    expect(treeWithNewElem[1].title)
      .toBe('parent 1')
    expect(treeWithNewElem[2].title)
      .toBe('newSibling')
    expect(treeWithNewElem[2].key)
      .toBe('0-2')
    expect(treeWithNewElem[2].children)
      .toBeUndefined()
  })
  describe('createChildrenIfNeeded: ', () => {
    it('createChildrenIfNeeded should return treeItem element with children', () => {
      const treeItem = { title: 'child', key: '0-0-1' }
      const titlesArr = ['child', 'child2', 'child3']
      const treeWithNewElem = createChildrenIfNeeded(treeItem, titlesArr)
      const { title, key, children } = treeWithNewElem
      expect(title)
        .toBe('child')
      expect(key)
        .toBe('0-0-1')
      expect(children)
        .toBeDefined()
      expect(children && children[0].key)
        .toBe('0-0-1-0')
      expect(children && children[0].title)
        .toBe('child2')
      expect(children && children[0].children)
        .toBeUndefined()
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
      expect(title)
        .toBe('folder') // different title
      expect(key)
        .toBe('0-0-1')
      expect(children)
        .toBeUndefined()
      expect(title2)
        .toBe('child') // titlesArr.length === 1
      expect(key2)
        .toBe('0-0-1')
      expect(children2)
        .toBeUndefined()
      expect(title3)
        .toBe('child') // treeItem has a child
      expect(key3)
        .toBe('0-0-1')
      expect(children3)
        .toBeDefined()
      expect(children3 && children3[0].title)
        .toBe('someTitle')
    })
  })
  describe('addSiblingIfNeeded: ', () => {
    it('should add sibling to treeItem element', () => {
      const tree = foldersSliceFolderTree
      const titlesArr = ['child', 'child2', 'child3']
      const treeWithNewElem = addSiblingIfNeeded(tree, titlesArr)
      const { title, key, children } = treeWithNewElem[2]
      expect(title)
        .toBe('child')
      expect(key)
        .toBe('0-2')
      expect(children)
        .toBeUndefined()
    })
    it('should keep old tree if conditions are not matched', () => {
      const tree = foldersSliceFolderTree
      const titlesArr2 = ['parent 1', 'child2', 'child3'] // isFoundItem === true
      const treeWithNewElem2 = addSiblingIfNeeded(tree, titlesArr2)
      expect(treeWithNewElem2)
        .toHaveLength(2)
      expect(treeWithNewElem2 && treeWithNewElem2[1].title)
        .toBe('parent 1')
    })
  })
  describe('addFolderToFolderTree: ', () => {
    it('should add new Folder (Test1 - parent 1/child2)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 1/child2'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest1
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON)
        .toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder (Test2 - parent 2)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 2'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest2
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON)
        .toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder (Test3 - main parent/leaf 0-1/child 1)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'main parent/leaf 0-1/child 1'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const snapshot = folderTreeForTest3
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON)
        .toBe(JSON.stringify(snapshot))
    })
    it('should add new Folder when folder tree is empty (Test4 - main parent)', () => {
      const folderPath = 'main parent'
      const updatedTree = addFolderToFolderTree(folderPath, [])
      const snapshot = folderTreeForTest4
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON)
        .toBe(JSON.stringify(snapshot))
    })
    it('should keep old tree if path exists (Test5 - parent 1/leaf 1-0)', () => {
      const tree = foldersSliceFolderTree
      const folderPath = 'parent 1/leaf 1-0'
      const updatedTree = addFolderToFolderTree(folderPath, tree)
      const updatedTreeJSON = JSON.stringify(updatedTree)
      expect(updatedTreeJSON)
        .toBe(JSON.stringify(tree))
    })
  })
  it('getFolderPathFromTreeKey should return valid path', () => {
    const folderPath = getFolderPathFromTreeKey(foldersSliceFolderTree, '0-1-0')
    expect(folderPath)
      .toBe('parent 1/leaf 1-0')
  })
  describe('expandedSearchingTreeKeysParents', () => {
    it('should return flattened tree', () => {
      const resultArray = expandedSearchingTreeKeysParents(folderTreeForFilteredTreeKeysTest, 'bom')
      expect(resultArray)
        .toEqual(['0-0-1', '0-0'])
    })
  })
  describe('expandedTreeKeyFromPath', () => {
    it('should return expanded keys', () => {
      const resultKey = expandedTreeKeyFromPath(folderTreeForFilteredTreeKeysTest, 'main parent/leaf 0-1/child bom')
      expect(resultKey.parentKeys)
        .toEqual(['0-0-1'])
      expect(resultKey.elementKey)
        .toBe('0-0-1-0')
      const resultKey2 = expandedTreeKeyFromPath(folderTreeForFilteredTreeKeysTest, 'parent 1 bom/leaf 1-1')
      expect(resultKey2.parentKeys)
        .toEqual(['0-1'])
      expect(resultKey2.elementKey)
        .toBe('0-1-1')
      const resultKey3 = expandedTreeKeyFromPath(folderTreeForFilteredTreeKeysTest, 'main parent/leaf 0-0')
      expect(resultKey3.parentKeys)
        .toEqual(['0-0'])
      expect(resultKey3.elementKey)
        .toBe('0-0-0')
    })
    it('should return an empty values if folder is wrong', () => {
      const resultKey = expandedTreeKeyFromPath(folderTreeForFilteredTreeKeysTest, 'parent 1 bom/leaf 0-')
      expect(resultKey.elementKey)
        .toBe('')
      expect(resultKey.parentKeys)
        .toEqual(['0-1'])
    })
  })
  describe('getExpandedTreeKeys', () => {
    it('should return flattened tree keys, if searching is just folder name', () => {
      const resultArray = getExpandedTreeKeys(folderTreeForFilteredTreeKeysTest, 'bom')
      expect(resultArray.parentKeys)
        .toEqual(['0-0-1', '0-0'])
      expect(resultArray.elementKey)
        .toBe('')
    })
    it('should return one expanded key, if there is a searching folder path', () => {
      const resultArray = getExpandedTreeKeys(folderTreeForFilteredTreeKeysTest, 'main parent/leaf 0-1/child bom')
      expect(resultArray.parentKeys)
        .toEqual(['0-0-1'])
      expect(resultArray.elementKey)
        .toBe('0-0-1-0')
    })
  })
  describe('getDirAndSubfolders', () => {
    it('should return an empty array for an empty string', () => {
      expect(getDirAndSubfolders(''))
        .toEqual([])
    })

    it('should return an empty array for a root directory', () => {
      expect(getDirAndSubfolders('/'))
        .toEqual([])
    })

    it('should return subfolders for a simple path', () => {
      expect(getDirAndSubfolders('a/b/c'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should return subfolders for a path with leading and trailing slashes', () => {
      expect(getDirAndSubfolders('/a/b/c/'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle paths with extra slashes', () => {
      expect(getDirAndSubfolders('///a///b///c///'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle a single directory', () => {
      expect(getDirAndSubfolders('a'))
        .toEqual(['a'])
    })

    it('should handle deeply nested directories', () => {
      expect(getDirAndSubfolders('a/b/c/d/e'))
        .toEqual(['a', 'a/b', 'a/b/c', 'a/b/c/d', 'a/b/c/d/e'])
    })
  })
  describe('addNewPathToPathsArr', () => {
    it('should add a new path with its subdirectories to an empty paths array', () => {
      const pathsArr: string[] = []
      const newPath = 'a/b/c'
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should add a new path with its subdirectories to a non-empty paths array', () => {
      const pathsArr = ['x', 'x/y']
      const newPath = 'a/b/c'
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual(['x', 'x/y', 'a', 'a/b', 'a/b/c'])
    })

    it('should not add duplicate paths', () => {
      const pathsArr = ['a', 'a/b']
      const newPath = 'a/b/c'
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle paths with leading and trailing slashes correctly', () => {
      const pathsArr: string[] = []
      const newPath = '/a/b/c/'
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle root directory correctly', () => {
      const pathsArr: string[] = []
      const newPath = '/'
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual([])
    })

    it('should handle an empty string as newPath correctly', () => {
      const pathsArr: string[] = []
      const newPath = ''
      const result = addNewPathToPathsArr(pathsArr, newPath)
      expect(result)
        .toEqual([])
    })
  })
  describe('getUpdatedPathsArrFromMediaList', () => {
    const media1 = new MediaInstance({ filePath: '/a/b/c/file1.jpg', mimetype: MimeTypes.jpeg, originalName: 'file1.jpg' })
    const media2 = new MediaInstance({ filePath: '/d/e/file2.jpg', mimetype: MimeTypes.jpeg, originalName: 'file2.jpg' })
    const media3 = new MediaInstance({ mimetype: MimeTypes.jpeg, originalName: 'file3.jpg' })
    const media4 = new MediaInstance({ filePath: '/f/g/h/file4.jpg', mimetype: MimeTypes.jpeg, originalName: 'file4.jpg' })
    const mediaList: Media[] = [
      media1,
      media2,
      media3,
      media4,
    ]

    it('should update paths array with paths from media list', () => {
      const actualPathsArr: string[] = []
      const result = getUpdatedPathsArrFromMediaList(mediaList, actualPathsArr)
      expect(result)
        .toEqual(['a', 'a/b', 'a/b/c', 'd', 'd/e', 'f', 'f/g', 'f/g/h'])
    })

    it('should append new paths to the existing paths array', () => {
      const actualPathsArr = ['x', 'x/y']
      const result = getUpdatedPathsArrFromMediaList(mediaList, actualPathsArr)
      expect(result)
        .toEqual(['x', 'x/y', 'a', 'a/b', 'a/b/c', 'd', 'd/e', 'f', 'f/g', 'f/g/h'])
    })

    it('should not add duplicate paths', () => {
      const actualPathsArr = ['a', 'a/b']
      const result = getUpdatedPathsArrFromMediaList(mediaList, actualPathsArr)
      expect(result)
        .toEqual(['a', 'a/b', 'a/b/c', 'd', 'd/e', 'f', 'f/g', 'f/g/h'])
    })

    it('should handle an empty media list correctly', () => {
      const actualPathsArr: string[] = ['x', 'x/y']
      const result = getUpdatedPathsArrFromMediaList([], actualPathsArr)
      expect(result)
        .toEqual(['x', 'x/y'])
    })
  })
})
