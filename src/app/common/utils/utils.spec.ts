import { keys } from 'ramda'

import { Media } from 'src/api/models/media'

import {
  uploadingFilesMock,
  uploadingFilesWithKeywordsMock,
} from '../tests/mock'

import {
  copyByJSON,
  getNameParts,
  removeEmptyFields,
  removeExtraSlash,
  updateFilesArrItemByField,
  removeIntersectingKeywords,
  addKeywordsToAllFiles,
  updateFilesArrayItems,
  getFilesWithUpdatedKeywords,
  getFilePathWithoutName,
  sanitizeDirectory,
} from './utils'

describe('utils: ', () => {
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
  describe('sanitizeDirectory', () => {
    it('should remove leading and trailing slashes', () => {
      expect(sanitizeDirectory('/path/to/dir/'))
        .toBe('path/to/dir')
      expect(sanitizeDirectory('///path/to/dir///'))
        .toBe('path/to/dir')
      expect(sanitizeDirectory('/path/to/dir'))
        .toBe('path/to/dir')
      expect(sanitizeDirectory('path/to/dir/'))
        .toBe('path/to/dir')
      expect(sanitizeDirectory('path/to/dir'))
        .toBe('path/to/dir')
      expect(sanitizeDirectory('/'))
        .toBe('')
      expect(sanitizeDirectory(''))
        .toBe('')
    })
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
  describe('removeIntersectingKeywords: ', () => {
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

    it('should remove first slash', () => {
      const fullFilePath = '/rootDirectory/директория с файлом/Имя для удаления.jpeg'
      const resultFilePath = 'rootDirectory/директория с файлом'
      expect(getFilePathWithoutName(fullFilePath))
        .toBe(resultFilePath)
    })
  })
})
