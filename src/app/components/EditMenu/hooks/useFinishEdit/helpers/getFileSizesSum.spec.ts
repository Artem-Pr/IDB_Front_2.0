import type { Media } from 'src/api/models/media'

import { getFileSizesSum } from './getFileSizesSum'

describe('getFileSizesSum', () => {
  const filesArr: Media[] = [
    { size: 1000 /* other properties */ } as Media,
    { size: 2000 /* other properties */ } as Media,
    { size: 3000 /* other properties */ } as Media,
  ]

  it('should return the sum of selected file sizes', () => {
    const selectedList = [0, 2]
    const result = getFileSizesSum(filesArr, selectedList)
    expect(result)
      .toBe(4000)
  })

  it('should return 0 if no files are selected', () => {
    const selectedList: number[] = []
    const result = getFileSizesSum(filesArr, selectedList)
    expect(result)
      .toBe(0)
  })

  it('should handle an empty files array', () => {
    const emptyFilesArr: Media[] = []
    const selectedList = [0, 1]
    const result = getFileSizesSum(emptyFilesArr, selectedList)
    expect(result)
      .toBe(0)
  })

  it('should ignore invalid indices in the selected list', () => {
    const selectedList = [0, 10]
    const result = getFileSizesSum(filesArr, selectedList)
    expect(result)
      .toBe(1000) // Only the first file is valid
  })
})
