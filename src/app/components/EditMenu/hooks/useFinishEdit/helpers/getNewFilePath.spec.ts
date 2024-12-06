import { getNewFilePath } from './getNewFilePath'

describe('getNewFilePath', () => {
  it('should return new file path with new name when isName is true', () => {
    const result = getNewFilePath(true, 'newFile.jpg', 'originalFile.jpg', '/path/to/file/')
    expect(result)
      .toBe('path/to/file/newFile.jpg')
  })

  it('should return new file path with original name when isName is false', () => {
    const result = getNewFilePath(false, 'newFile.jpg', 'originalFile.jpg', '/path/to/file/')
    expect(result)
      .toBe('path/to/file/originalFile.jpg')
  })

  it('should handle file paths without slashes correctly', () => {
    const result = getNewFilePath(true, 'newFile.jpg', 'originalFile.jpg', 'path/to/file')
    expect(result)
      .toBe('path/to/file/newFile.jpg')
  })

  it('should handle file paths with leading slashes correctly', () => {
    const result = getNewFilePath(true, 'newFile.jpg', 'originalFile.jpg', '/path/to/file')
    expect(result)
      .toBe('path/to/file/newFile.jpg')
  })

  it('should handle file paths with trailing slashes correctly', () => {
    const result = getNewFilePath(true, 'newFile.jpg', 'originalFile.jpg', 'path/to/file/')
    expect(result)
      .toBe('path/to/file/newFile.jpg')
  })
})
