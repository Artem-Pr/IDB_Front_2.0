import { FullExifObj, NameParts, UploadingObject } from '../../redux/types'

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

export const uploadingFilesMock: UploadingObject[] = [
  {
    changeDate: 1601655242277,
    keywords: [],
    megapixels: 8,
    name: '123.jpg',
    originalDate: '24.06.2019',
    preview: 'http://localhost:5000/images/47e5ff7410eeeee9506ca446b9498ad8-preview.jpg',
    size: 2805824,
    tempPath: 'temp/47e5ff7410eeeee9506ca446b9498ad8',
    fullSizeJpgPath: 'uploadTemp/41e082ea221bf0afbcfde106859cfba5-fullSize.jpg',
    type: 'image/jpeg',
    rating: 0,
    description: '',
    DBFullPathFullSize: '',
    DBFullPath: '',
  },
  {
    changeDate: 1601655242277,
    keywords: null,
    megapixels: '',
    name: 'IMG_20190624_110245.jpg',
    originalDate: '-',
    preview: 'http://localhost:5000/images/f3a168e5d6c61fd02b9b227219011462-preview.jpg',
    size: 2191001,
    tempPath: 'temp/f3a168e5d6c61fd02b9b227219011462',
    fullSizeJpgPath: 'uploadTemp/41e082ea221bf0afbcfde106859cfba5-fullSize.jpg',
    type: 'image/jpeg',
    rating: 0,
    description: '',
    DBFullPathFullSize: '',
    DBFullPath: '',
  },
  {
    changeDate: 1601655242277,
    keywords: null,
    megapixels: 12,
    name: 'IMG_20190624_110312.jpg',
    originalDate: '24.09.2016',
    preview: 'http://localhost:5000/images/33237a85357bbb9c4d7c8da122ef3c0a-preview.jpg',
    size: 2812368,
    tempPath: 'temp/33237a85357bbb9c4d7c8da122ef3c0a',
    fullSizeJpgPath: 'uploadTemp/41e082ea221bf0afbcfde106859cfba5-fullSize.jpg',
    type: 'image/jpeg',
    rating: 0,
    description: '',
    DBFullPathFullSize: '',
    DBFullPath: '',
  },
]

export const fullExifObjArr: FullExifObj[] = [
  {
    Megapixels: 8,
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
    },
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
    },
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
    },
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

export const uploadingFilesWithKeywordsMock: Omit<UploadingObject, 'keywords'>[] = uploadingFilesMock.map(
  (item, i) => ({
    ...item,
    keywords: fullExifObjArr[i].Keywords,
  })
)

export const namePartsArrMock: NameParts[] = [
  { shortName: 'дорога домой', ext: 'img' },
  { shortName: 'Estonia', ext: 'mp4' },
  { shortName: 'bom-bom', ext: 'somethingLong' },
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
