import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'
import { NameParts } from 'src/redux/types'
import { MimeTypes } from 'src/redux/types/MimeTypes'

export const foldersSliceFolderTree = [
  {
    title: 'main parent',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1' },
      { title: 'parent 0-2', key: '0-0-2' },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
    ],
  },
]

export const folderTreeForTest1 = [
  {
    title: 'main parent',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1' },
      { title: 'parent 0-2', key: '0-0-2' },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
      { title: 'child2', key: '0-1-2' },
    ],
  },
]

export const folderTreeForTest2 = [
  {
    title: 'main parent',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1' },
      { title: 'parent 0-2', key: '0-0-2' },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
    ],
  },
  {
    title: 'parent 2',
    key: '0-2',
  },
]

export const folderTreeForTest3 = [
  {
    title: 'main parent',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1', children: [{ title: 'child 1', key: '0-0-1-0' }] },
      { title: 'parent 0-2', key: '0-0-2' },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
    ],
  },
]

export const folderTreeForTest4 = [
  {
    title: 'main parent',
    key: '0-0',
  },
]

export const uploadingFilesMock: Media[] = [
  {
    id: '47e5ff7410eeeee9506ca446b9498ad8',
    filePath: '/images/47e5ff7410eeeee9506ca446b9498ad8.jpg',
    imageSize: '300x300',
    changeDate: '2024-01-06T14:52:34.000Z',
    keywords: [],
    megapixels: 8,
    originalName: '123.jpg',
    originalDate: '24.06.2019',
    staticPreview: 'http://localhost:5000/images/47e5ff7410eeeee9506ca446b9498ad8-preview.jpg',
    staticPath: 'http://localhost:5000/images/47e5ff7410eeeee9506ca446b9498ad8.jpg',
    size: 2805824,
    mimetype: MimeTypes.jpeg,
    rating: 0,
    description: '',
    timeStamp: '',
    duplicates: [],
  },
  {
    id: 'f3a168e5d6c61fd02b9b227219011462',
    filePath: '/images/f3a168e5d6c61fd02b9b227219011462.jpg',
    imageSize: '300x300',
    changeDate: '2024-01-06T14:52:34.000Z',
    keywords: ['keyword1', 'keyword2'],
    megapixels: null,
    originalName: 'IMG_20190624_110245.jpg',
    originalDate: '-',
    staticPreview: 'http://localhost:5000/images/f3a168e5d6c61fd02b9b227219011462-preview.jpg',
    staticPath: 'http://localhost:5000/images/f3a168e5d6c61fd02b9b227219011462.jpg',
    size: 2191001,
    mimetype: MimeTypes.jpeg,
    rating: 0,
    description: '',
    timeStamp: '',
    duplicates: [],
  },
  {
    id: '33237a85357bbb9c4d7c8da122ef3c0a',
    filePath: '/images/33237a85357bbb9c4d7c8da122ef3c0a.jpg',
    imageSize: '300x300',
    changeDate: '2024-01-06T14:52:34.000Z',
    keywords: [],
    megapixels: 12,
    originalName: 'IMG_20190624_110312.jpg',
    originalDate: '24.09.2016',
    staticPreview: 'http://localhost:5000/images/33237a85357bbb9c4d7c8da122ef3c0a-preview.jpg',
    staticPath: 'http://localhost:5000/images/33237a85357bbb9c4d7c8da122ef3c0a.jpg',
    size: 2812368,
    mimetype: MimeTypes.jpeg,
    rating: 0,
    description: '',
    timeStamp: '',
    duplicates: [],
  },
]

export const fullExifObjArr: Tags[] = [
  {
    Megapixels: 8,
    GPSLatitude: 0,
    GPSLongitude: 0,
    DateTimeOriginal: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['DateTimeOriginal'],
    CreateDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreateDate'],
    CreationDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreationDate'],
    Keywords: ['Озеро', 'Эстония', 'Оля'],
    Subject: ['Озеро', 'Эстония', 'Оля'],
    Rating: 0,
    Description: '',
    ISO: 100,
    ImageHeight: 2448,
    ImageSize: '3264x2448',
    ImageWidth: 3264,
    InteropIndex: 'R98 - DCF basic file (sRGB)',
    InteropVersion: '0100',
    JFIFVersion: 1.01,
    LightValue: 12,
    Luminance: '0 80 0',
    Make: 'LGE',
  },
  {
    Megapixels: 8,
    GPSLatitude: 0,
    GPSLongitude: 0,
    DateTimeOriginal: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['DateTimeOriginal'],
    CreateDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreateDate'],
    CreationDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreationDate'],
    Keywords: ['Эстония', 'Карта'],
    Subject: ['Эстония', 'Карта'],
    Rating: 0,
    Description: '',
    ISO: 100,
    ImageHeight: 2448,
    ImageSize: '3264x2448',
    ImageWidth: 3264,
    InteropIndex: 'R98 - DCF basic file (sRGB)',
    InteropVersion: '0100',
    JFIFVersion: 1.01,
    LightValue: 12,
    Luminance: '0 80 0',
    Make: 'LGE',
  },
  {
    Megapixels: 8,
    GPSLatitude: 0,
    GPSLongitude: 0,
    DateTimeOriginal: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['DateTimeOriginal'],
    CreateDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreateDate'],
    CreationDate: {
      year: 2008,
      month: 1,
      day: 1,
      hour: 23,
      minute: 20,
      second: 23,
      millisecond: undefined,
      tzoffsetMinutes: undefined,
      rawValue: '2019:06:24 11:02:25',
      zoneName: undefined,
    } as Tags['CreationDate'],
    Keywords: ['Эстония', 'Озеро', 'Велосипед', 'Оля'],
    Subject: ['Эстония', 'Озеро', 'Велосипед', 'Оля'],
    Rating: 0,
    Description: '',
    ISO: 100,
    ImageHeight: 2448,
    ImageSize: '3264x2448',
    ImageWidth: 3264,
    InteropIndex: 'R98 - DCF basic file (sRGB)',
    InteropVersion: '0100',
    JFIFVersion: 1.01,
    LightValue: 12,
    Luminance: '0 80 0',
    Make: 'LGE',
  },
]

export const uploadingFilesWithKeywordsMock: Media[] = uploadingFilesMock.map(
  (item, i) => ({
    ...item,
    keywords: fullExifObjArr[i].Keywords as Media['keywords'],
  }),
)

export const namePartsArrMock: NameParts[] = [
  { shortName: 'дорога домой', ext: '.jpg' },
  { shortName: 'Estonia', ext: '.mp4' },
  { shortName: 'bom-bom', ext: '.somethingLong' as NameParts['ext'] },
]

export const folderTreeForFilteredTreeKeysTest = [
  {
    title: 'main parent',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        children: [
          { title: 'child bom', key: '0-0-1-0' },
          { title: 'child 1', key: '0-0-1-0' },
        ],
      },
      { title: 'parent bom 0-2', key: '0-0-2' },
    ],
  },
  {
    title: 'parent 1 bom',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
    ],
  },
]
