import { getFolderPathFromTreeKey } from '../../app/common/utils'
import { foldersSliceFolderTree } from './mock'

describe('utils: ', () => {
  it('getFolderPathFromTreeKey should return valid path', () => {
    const folderPath = getFolderPathFromTreeKey('0-1-0', foldersSliceFolderTree)
    expect(folderPath).toBe('parent 1/leaf 1-0')
  })
})
