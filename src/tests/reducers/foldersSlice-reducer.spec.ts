import { setFolderTree } from '../../redux/reducers/foldersSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree } from '../common/mock'
import { folderTree } from '../../redux/selectors'

describe('foldersSlice-reducer: ', () => {
  it('should set folderTree', async function () {
    await store.dispatch(setFolderTree(foldersSliceFolderTree))
    const state = store.getState()
    expect(folderTree(state)[0].title).toBe('main parent')
  })
})
