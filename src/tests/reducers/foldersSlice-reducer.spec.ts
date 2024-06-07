import { foldersSliceFolderTree } from '../../app/common/tests/mock'
import { setFolderTree, setCurrentFolderPath, setPathsArr } from '../../redux/reducers/foldersSlice/foldersSlice'
import { pathsArr } from '../../redux/selectors'
import store from '../../redux/store/store'

describe('foldersSlice-reducer: ', () => {
  it('should set folderTree', async () => {
    await store.dispatch(setFolderTree(foldersSliceFolderTree))
    const state = store.getState()
    expect(state.folderReducer.folderTree[0].title)
      .toBe('main parent')
  })
  it('should set currentFolderPath', async () => {
    await store.dispatch(setCurrentFolderPath('home/path'))
    const state = store.getState()
    expect(state.folderReducer.currentFolderInfo.currentFolderPath)
      .toBe('home/path')
  })
  it('should set pathsArr', async () => {
    const folderPath = ['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']
    await store.dispatch(setPathsArr(folderPath))
    const state = store.getState()
    expect(pathsArr(state)[3])
      .toBe('/home')
  })
})
