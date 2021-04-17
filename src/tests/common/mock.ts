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
