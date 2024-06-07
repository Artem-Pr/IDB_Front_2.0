import { keys } from 'ramda'

import { Media } from 'src/api/models/media'
import { NameParts } from 'src/redux/types'

import {
  addChildToTreeElem,
  addFolderToFolderTree,
  addSiblingIfNeeded,
  addSiblingToTree,
  createChildrenIfNeeded,
  createKeyForFolderTree,
  expandedSearchingTreeKeysParents,
  expandedTreeKeyFromPath,
  getExpandedTreeKeys,
  getFolderPathFromTreeKey,
} from '../folderTree'
import {
  foldersSliceFolderTree,
  folderTreeForFilteredTreeKeysTest,
  folderTreeForTest1,
  folderTreeForTest2,
  folderTreeForTest3,
  folderTreeForTest4,
  namePartsArrMock,
  uploadingFilesMock,
  uploadingFilesWithKeywordsMock,
} from '../tests/mock'

import {
  copyByJSON,
  getNameParts,
  removeEmptyFields,
  removeExtraSlash,
  updateFilesArrItemByField,
  renameEqualStrings,
  removeIntersectingKeywords,
  addKeywordsToAllFiles,
  updateFilesArrayItems,
  getRenamedObjects,
  renameShortNames,
  getFilesWithUpdatedKeywords,
  getFilePathWithoutName,
} from './utils'

describe('utils: ', () => {
  describe('getExpandedTree', () => {
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
  describe('expandedSearchingTreeKeysParents', () => {
    it('should return flattened tree', () => {
      const resultArray = expandedSearchingTreeKeysParents(folderTreeForFilteredTreeKeysTest, 'bom')
      expect(resultArray)
        .toEqual(['0-0-1', '0-0'])
    })
  })
  it('removeExtraSlash should remove slash at the end of string', () => {
    const value1 = removeExtraSlash('string/')
    const value2 = removeExtraSlash('string/folder/')
    const value3 = removeExtraSlash('string/folder')
    const value4 = removeExtraSlash('string')
    const value5 = removeExtraSlash('')
    expect(value1)
      .toBe('string')
    expect(value2)
      .toBe('string/folder')
    expect(value3)
      .toBe('string/folder')
    expect(value4)
      .toBe('string')
    expect(value5)
      .toBe('')
  })
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
  describe('getNameParts: ', () => {
    it('should return right object', () => {
      const fullName = 'myPhoto.jpg'
      const fullName2 = 'myPhoto.bom-bom.bom.jpeg'
      const { shortName, ext } = getNameParts(fullName)
      const { shortName: shortName2, ext: ext2 } = getNameParts(fullName2)
      expect(shortName)
        .toBe('myPhoto')
      expect(shortName2)
        .toBe('myPhoto.bom-bom.bom')
      expect(ext)
        .toBe('.jpg')
      expect(ext2)
        .toBe('.jpeg')
    })
    it('should return empty values if name is not valid', () => {
      const fullName = ''
      const fullName2 = '-'
      const { shortName, ext } = getNameParts(fullName)
      const { shortName: shortName2, ext: ext2 } = getNameParts(fullName2)
      expect(shortName)
        .toBe('-')
      expect(shortName2)
        .toBe('-')
      expect(ext)
        .toBe('')
      expect(ext2)
        .toBe('')
    })
  })
  describe('updateFilesArrItemByField: ', () => {
    it('should return updated obj', () => {
      const originalObjArr = uploadingFilesMock
      const objectForUpdate: Partial<Media> = {
        filePath: '/temp/f3a168e5d6c61fd02b9b227219011462.jpg',
        keywords: ['bom-bom'],
        megapixels: 24,
        originalDate: '12.12.2012',
      }
      const updatedObjArr = updateFilesArrItemByField('filePath', originalObjArr, objectForUpdate)
      expect(updatedObjArr[1].originalName)
        .toBe(uploadingFilesMock[1].originalName)
      expect(updatedObjArr[1].keywords)
        .toEqual(uploadingFilesMock[1].keywords)
      expect(updatedObjArr[1].megapixels)
        .toEqual(uploadingFilesMock[1].megapixels)
      expect(updatedObjArr[1].originalDate)
        .toBe(uploadingFilesMock[1].originalDate)
      expect(updatedObjArr)
        .toHaveLength(3)
      expect(updatedObjArr[2].originalDate)
        .toBe(uploadingFilesMock[2].originalDate)
    })
  })
  describe('removeEmptyFields: ', () => {
    it('should remove empty fields', () => {
      const textOpj = {
        tempPath: 'temp/f3a168e5d6c61fd02b9b227219011462',
        keywords: '',
        megapixels: null,
        originalDate: '12.12.2012',
      }
      const cleanObj = removeEmptyFields(textOpj)
      expect(keys(cleanObj))
        .toHaveLength(2)
      expect(cleanObj.tempPath)
        .toBe('temp/f3a168e5d6c61fd02b9b227219011462')
      expect(cleanObj.originalDate)
        .toBe('12.12.2012')
    })
  })
  describe('renameEqualStrings: ', () => {
    it('should return renamed array', () => {
      const arr = ['hello', 'test', 'hello', 'what', 'oh', 'hello', 'oh', 'no']
      const newArr = renameEqualStrings(arr)
      expect(newArr)
        .toHaveLength(8)
      expect(newArr)
        .toEqual(['hello_001', 'test', 'hello_002', 'what', 'oh_001', 'hello_003', 'oh_002', 'no'])
    })
  })
  describe('renameShortNames: ', () => {
    it('should return NameParts with updated names if names are the same', () => {
      const nameParts = namePartsArrMock.map(item => ({ ...item, shortName: 'дорога домой' }))
      const newNameParts: NameParts[] = renameShortNames(nameParts)
      expect(newNameParts)
        .toHaveLength(3)
      expect(JSON.stringify(newNameParts[0]))
        .toBe('{"shortName":"дорога домой_001","ext":".jpg"}')
      expect(JSON.stringify(newNameParts[1]))
        .toBe('{"shortName":"дорога домой_002","ext":".mp4"}')
      expect(JSON.stringify(newNameParts[2]))
        .toBe('{"shortName":"дорога домой_003","ext":".somethingLong"}')
    })
  })
  describe('getRenamedObjects: ', () => {
    it('should return array of objects with updated names', () => {
      const filesArr: Media[] = uploadingFilesMock.map(item => ({ ...item, originalName: 'IMG_20190624_110245.jpg' }))
      const newNamesObjectArr = getRenamedObjects(filesArr)
      expect(newNamesObjectArr)
        .toHaveLength(3)
      expect(newNamesObjectArr[0].originalName)
        .toBe('IMG_20190624_110245_001.jpg')
      expect(newNamesObjectArr[1].originalName)
        .toBe('IMG_20190624_110245_002.jpg')
      expect(newNamesObjectArr[2].originalName)
        .toBe('IMG_20190624_110245_003.jpg')
    })
  })
  describe('removeKeywordFromEveryFile: ', () => {
    it('should return files array without certain keyword', () => {
      const newFilesArr = removeIntersectingKeywords(['Оля'], copyByJSON(uploadingFilesWithKeywordsMock))
      const newFilesArr2 = removeIntersectingKeywords(['Оля', 'Карта'], copyByJSON(uploadingFilesWithKeywordsMock))
      expect(newFilesArr)
        .toHaveLength(3)
      expect(JSON.stringify(newFilesArr[0].keywords))
        .toBe('["Озеро","Эстония"]')
      expect(JSON.stringify(newFilesArr[1].keywords))
        .toBe('["Эстония","Карта"]')
      expect(JSON.stringify(newFilesArr[2].keywords))
        .toBe('["Эстония","Озеро","Велосипед"]')
      expect(newFilesArr2)
        .toHaveLength(3)
      expect(JSON.stringify(newFilesArr2[0].keywords))
        .toBe('["Озеро","Эстония"]')
      expect(JSON.stringify(newFilesArr2[1].keywords))
        .toBe('["Эстония"]')
      expect(JSON.stringify(newFilesArr2[2].keywords))
        .toBe('["Эстония","Озеро","Велосипед"]')
    })
  })
  describe('addKeywordsToAllFiles: ', () => {
    it('should add new keywords to every file in array', () => {
      const fileArr = copyByJSON(uploadingFilesWithKeywordsMock)
      const newFilesArr = addKeywordsToAllFiles(['Природа'], fileArr)
      const newFilesArr2 = addKeywordsToAllFiles(['Природа', 'Покатушки', 'Оля'], fileArr)
      expect(newFilesArr)
        .toHaveLength(3)
      expect(JSON.stringify(newFilesArr[0].keywords))
        .toBe('["Природа","Озеро","Эстония","Оля"]')
      expect(JSON.stringify(newFilesArr[1].keywords))
        .toBe('["Природа","Эстония","Карта"]')
      expect(JSON.stringify(newFilesArr[2].keywords))
        .toBe('["Природа","Эстония","Озеро","Велосипед","Оля"]')
      expect(newFilesArr2)
        .toHaveLength(3)
      expect(JSON.stringify(newFilesArr2[0].keywords))
        .toBe('["Природа","Покатушки","Оля","Озеро","Эстония"]')
      expect(JSON.stringify(newFilesArr2[1].keywords))
        .toBe('["Природа","Покатушки","Оля","Эстония","Карта"]')
      expect(JSON.stringify(newFilesArr2[2].keywords))
        .toBe(
          '["Природа","Покатушки","Оля","Эстония","Озеро","Велосипед"]',
        )
    })
  })
  describe('updateFilesArrayItems: ', () => {
    it('should return updated filesArr', () => {
      const originalFileArr: Media[] = copyByJSON(uploadingFilesWithKeywordsMock)
      const filteredFilesArr: Media[] = originalFileArr.filter((_, i) => i !== 1)
      const changedFilteredArr: Media[] = filteredFilesArr.map(item => ({ ...item, originalName: 'bom.jpg' }))
      const updatedFilesArr = updateFilesArrayItems('id', originalFileArr, changedFilteredArr)
      expect(updatedFilesArr)
        .toHaveLength(3)
      expect(updatedFilesArr[0].originalName)
        .toBe('bom.jpg')
      expect(updatedFilesArr[1].originalName)
        .toBe('IMG_20190624_110245.jpg')
      expect(updatedFilesArr[2].originalName)
        .toBe('bom.jpg')
    })
  })
  describe('getFilesWithUpdatedKeywords: ', () => {
    it('should return files array with updated keywords', () => {
      const filesArr = copyByJSON(uploadingFilesWithKeywordsMock)
      const updatedFilesArr = getFilesWithUpdatedKeywords(filesArr, ['Велосипед', 'google'])
      expect(updatedFilesArr)
        .toHaveLength(3)
      expect(JSON.stringify(updatedFilesArr[0].keywords))
        .toBe('["Велосипед","google","Озеро","Эстония","Оля"]')
      expect(JSON.stringify(updatedFilesArr[1].keywords))
        .toBe('["Велосипед","google","Эстония","Карта"]')
      expect(JSON.stringify(updatedFilesArr[2].keywords))
        .toBe('["Велосипед","google","Эстония","Озеро","Оля"]')
    })
  })
  describe('getFilePathWithoutName: ', () => {
    it('should return file path without name', () => {
      const fullFilePath = 'rootDirectory/директория с файлом/Имя для удаления.jpeg'
      const resultFilePath = 'rootDirectory/директория с файлом'
      expect(getFilePathWithoutName(fullFilePath))
        .toBe(resultFilePath)
    })
  })
})
