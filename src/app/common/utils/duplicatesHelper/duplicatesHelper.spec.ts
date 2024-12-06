/* eslint-disable newline-per-chained-call */
import { FileNameWithExt, Media, MediaInstance } from 'src/api/models/media'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import { applyOldNamesIfDuplicates, renameOriginalNameIfNeeded } from './duplicatesHelper'

describe('duplicatesHelper', () => {
  describe('renameOriginalNameIfNeeded: ', () => {
    it('should return array of objects with updated names', () => {
      const filesArr = [
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'test.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'what.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'no.jpg', mimetype: MimeTypes.jpeg }),
      ]
      const newNamesObjectArr = renameOriginalNameIfNeeded(filesArr)
      const resultNames = newNamesObjectArr.map(obj => obj.originalName)
      expect(resultNames).toEqual(['hello_001.jpg', 'test.jpg', 'hello_002.jpg', 'what.jpg', 'oh_001.jpg', 'hello_003.jpg', 'oh_002.jpg', 'no.jpg'])
    })

    it('should increment number if name with the same number already exists', () => {
      const filesArr = [
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'test.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'what.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'no.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello_001.jpg', mimetype: MimeTypes.jpeg }),
      ]
      const newNamesObjectArr = renameOriginalNameIfNeeded(filesArr)
      const resultNames = newNamesObjectArr.map(obj => obj.originalName)
      expect(resultNames).toEqual(['hello_002.jpg', 'test.jpg', 'hello_003.jpg', 'what.jpg', 'oh_001.jpg', 'hello_004.jpg', 'oh_002.jpg', 'no.jpg', 'hello_001.jpg'])
    })

    it('should rename filePaths if needed', () => {
      const filesArr = [
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'test.jpg', mimetype: MimeTypes.jpeg, filePath: '/path/to/file.jpg' }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg, filePath: '/path/to/hello.png' }),
        new MediaInstance({ originalName: 'what.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'hello.jpg', mimetype: MimeTypes.jpeg, filePath: '/path/to/1.jpg' }),
        new MediaInstance({ originalName: 'oh.jpg', mimetype: MimeTypes.jpeg }),
        new MediaInstance({ originalName: 'no.jpg', mimetype: MimeTypes.jpeg, filePath: '/path/to/2.jpg' }),
      ]
      const newNamesObjectArr = renameOriginalNameIfNeeded(filesArr)
      const resultNames = newNamesObjectArr.map(({ originalName, filePath }) => ({ originalName, filePath }))
      expect(resultNames).toEqual([
        {
          filePath: null,
          originalName: 'hello_001.jpg',
        },
        {
          filePath: '/path/to/test.jpg',
          originalName: 'test.jpg',
        },
        {
          filePath: '/path/to/hello_002.jpg',
          originalName: 'hello_002.jpg',
        },
        {
          filePath: null,
          originalName: 'what.jpg',
        },
        {
          filePath: null,
          originalName: 'oh_001.jpg',
        },
        {
          filePath: '/path/to/hello_003.jpg',
          originalName: 'hello_003.jpg',
        },
        {
          filePath: null,
          originalName: 'oh_002.jpg',
        },
        {
          filePath: '/path/to/no.jpg',
          originalName: 'no.jpg',
        },
      ])
    })
  })

  describe('applyOldNamesIfDuplicates: ', () => {
    const getMedia = (id: string, name: FileNameWithExt): Media => (
      new MediaInstance({ id, originalName: name, mimetype: MimeTypes.jpeg }).properties
    )

    it('should return files array without duplicates and list of duplicate names', () => {
      const newFilesArr = [
        getMedia('1', 'file1-new.jpg'),
        getMedia('2', 'duplicate1.jpg'),
        getMedia('3', 'file3-new.jpg'),
        getMedia('4', 'duplicate2.jpg'),
        getMedia('5', 'duplicate1.jpg'),
        getMedia('6', 'duplicate1.jpg'),
        getMedia('7', 'duplicate2.jpg'),
      ]
      const oldFilesArr = [
        getMedia('1', 'file1.jpg'),
        getMedia('2', 'file2.jpg'),
        getMedia('3', 'file3.jpg'),
        getMedia('4', 'file4.jpg'),
        getMedia('5', 'file5.jpg'),
        getMedia('6', 'file6.jpg'),
        getMedia('7', 'file7.jpg'),
      ]
      const { filesArrWithoutDuplicates, duplicatesNames } = applyOldNamesIfDuplicates(newFilesArr, oldFilesArr)

      expect(filesArrWithoutDuplicates).toEqual([
        getMedia('1', 'file1-new.jpg'),
        getMedia('2', 'file2.jpg'),
        getMedia('3', 'file3-new.jpg'),
        getMedia('4', 'file4.jpg'),
        getMedia('5', 'file5.jpg'),
        getMedia('6', 'file6.jpg'),
        getMedia('7', 'file7.jpg'),
      ])
      expect(duplicatesNames).toEqual(['duplicate1.jpg', 'duplicate2.jpg'])
    })

    it('should not change original names if no duplicates are found', () => {
      const newFilesArr = [
        getMedia('1', 'file1.jpg'),
        getMedia('2', 'file2.jpg'),
      ]
      const oldFilesArr = [
        getMedia('1', 'file3.jpg'),
        getMedia('2', 'file4.jpg'),
      ]
      const { filesArrWithoutDuplicates, duplicatesNames } = applyOldNamesIfDuplicates(newFilesArr, oldFilesArr)

      expect(filesArrWithoutDuplicates).toEqual(newFilesArr)
      expect(duplicatesNames).toEqual([])
    })
  })
})
