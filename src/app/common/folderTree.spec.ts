import { getDirAndSubfolders } from './folderTree'

describe('folderTree: ', () => {
  describe('getDirAndSubfolders', () => {
    it('should return an empty array for an empty string', () => {
      expect(getDirAndSubfolders(''))
        .toEqual([])
    })

    it('should return an empty array for a root directory', () => {
      expect(getDirAndSubfolders('/'))
        .toEqual([])
    })

    it('should return subfolders for a simple path', () => {
      expect(getDirAndSubfolders('a/b/c'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should return subfolders for a path with leading and trailing slashes', () => {
      expect(getDirAndSubfolders('/a/b/c/'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle paths with extra slashes', () => {
      expect(getDirAndSubfolders('///a///b///c///'))
        .toEqual(['a', 'a/b', 'a/b/c'])
    })

    it('should handle a single directory', () => {
      expect(getDirAndSubfolders('a'))
        .toEqual(['a'])
    })

    it('should handle deeply nested directories', () => {
      expect(getDirAndSubfolders('a/b/c/d/e'))
        .toEqual(['a', 'a/b', 'a/b/c', 'a/b/c/d', 'a/b/c/d/e'])
    })
  })
})
