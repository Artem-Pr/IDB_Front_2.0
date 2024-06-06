import { uploadingFilesMock } from '../../tests/mock'

import { getFileAPIRequestFromMedia, getFileAPIRequestFromMediaList } from './getFileAPIRequestFromMedia'

describe('getFileAPIRequestFromMedia file:', () => {
  const mockedMediaArr = uploadingFilesMock
  const updatedFolderPath = 'images/folder'
  const mockActual = [
    {
      id: mockedMediaArr[0].id,
      updatedFields: {
        changeDate: mockedMediaArr[0].changeDate,
        description: mockedMediaArr[0].description,
        filePath: mockedMediaArr[0].filePath,
        keywords: mockedMediaArr[0].keywords,
        originalDate: mockedMediaArr[0].originalDate,
        originalName: mockedMediaArr[0].originalName,
        rating: mockedMediaArr[0].rating,
        timeStamp: mockedMediaArr[0].timeStamp,
      },
    },
    {
      id: mockedMediaArr[1].id,
      updatedFields: {
        changeDate: mockedMediaArr[1].changeDate,
        description: mockedMediaArr[1].description,
        filePath: mockedMediaArr[1].filePath,
        keywords: mockedMediaArr[1].keywords,
        originalDate: mockedMediaArr[1].originalDate,
        originalName: mockedMediaArr[1].originalName,
        rating: mockedMediaArr[1].rating,
        timeStamp: mockedMediaArr[1].timeStamp,
      },
    },
    {
      id: mockedMediaArr[2].id,
      updatedFields: {
        changeDate: mockedMediaArr[2].changeDate,
        description: mockedMediaArr[2].description,
        filePath: mockedMediaArr[2].filePath,
        keywords: mockedMediaArr[2].keywords,
        originalDate: mockedMediaArr[2].originalDate,
        originalName: mockedMediaArr[2].originalName,
        rating: mockedMediaArr[2].rating,
        timeStamp: mockedMediaArr[2].timeStamp,
      },
    },
  ]

  describe('getFileAPIRequestFromMedia', () => {
    it('should return updated file api request', () => {
      const actual = mockActual[0]
      const result = getFileAPIRequestFromMedia(mockedMediaArr[0])
      expect(result)
        .toEqual(actual)
    })

    it('should return updated file api request with updated file path', () => {
      const actual = {
        ...mockActual[0],
        updatedFields: {
          ...mockActual[0].updatedFields,
          filePath: '/images/folder/123.jpg',
        },
      }
      const result = getFileAPIRequestFromMedia(mockedMediaArr[0], updatedFolderPath)
      expect(result)
        .toEqual(actual)
    })
  })

  describe('getFileAPIRequestFromMediaList', () => {
    it('should return updated file api request list', () => {
      const result = getFileAPIRequestFromMediaList(mockedMediaArr)
      expect(result)
        .toEqual(mockActual)
    })

    it('should return updated file api request list with updated file path', () => {
      const actual = [
        {
          ...mockActual[0],
          updatedFields: {
            ...mockActual[0].updatedFields,
            filePath: '/images/folder/123.jpg',
          },
        },
        {
          ...mockActual[1],
          updatedFields: {
            ...mockActual[1].updatedFields,
            filePath: '/images/folder/IMG_20190624_110245.jpg',
          },
        },
        {
          ...mockActual[2],
          updatedFields: {
            ...mockActual[2].updatedFields,
            filePath: '/images/folder/IMG_20190624_110312.jpg',
          },
        },
      ]
      const result = getFileAPIRequestFromMediaList(mockedMediaArr, updatedFolderPath)
      expect(result)
        .toEqual(actual)
    })
  })
})
