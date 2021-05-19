import { setFolderTree, setCurrentFolderPath, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree } from '../common/mock'
import { pathsArr } from '../../redux/selectors'

describe('foldersSlice-reducer: ', () => {
  it('should set folderTree', async function () {
    await store.dispatch(setFolderTree(foldersSliceFolderTree))
    const state = store.getState()
    expect(state.folderReducer.folderTree[0].title).toBe('main parent')
  })
  it('should set currentFolderPath', async function () {
    await store.dispatch(setCurrentFolderPath('home/path'))
    const state = store.getState()
    expect(state.folderReducer.currentFolderPath).toBe('home/path')
  })
  it('should set pathsArr', async function () {
    const folderPath = ['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']
    await store.dispatch(setPathsArr(folderPath))
    const state = store.getState()
    expect(pathsArr(state)[3]).toBe('/home')
  })
})
