import { UploadingObject } from '../../redux/types'

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
    changeDate: '24.06.2019',
    keywords: [],
    megapixels: 8,
    name: '123.jpg',
    originalDate: '24.06.2019',
    preview: 'http://localhost:5000/images/47e5ff7410eeeee9506ca446b9498ad8-preview.jpg',
    size: 2805824,
    tempPath: 'temp/47e5ff7410eeeee9506ca446b9498ad8',
    type: 'image/jpeg',
  },
  {
    changeDate: '01.01.2021',
    keywords: null,
    megapixels: '',
    name: 'IMG_20190624_110245.jpg',
    originalDate: '-',
    preview: 'http://localhost:5000/images/f3a168e5d6c61fd02b9b227219011462-preview.jpg',
    size: 2191001,
    tempPath: 'temp/f3a168e5d6c61fd02b9b227219011462',
    type: 'image/jpeg',
  },
  {
    changeDate: '12.12.2017',
    keywords: null,
    megapixels: 12,
    name: 'IMG_20190624_110312.jpg',
    originalDate: '24.09.2016',
    preview: 'http://localhost:5000/images/33237a85357bbb9c4d7c8da122ef3c0a-preview.jpg',
    size: 2812368,
    tempPath: 'temp/33237a85357bbb9c4d7c8da122ef3c0a',
    type: 'image/jpeg',
  },
]
