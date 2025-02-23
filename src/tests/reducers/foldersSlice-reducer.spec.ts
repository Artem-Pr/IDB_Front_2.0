import { getFolderReducerFolderPathsArr } from 'src/redux/reducers/foldersSlice/selectors'

import { foldersSliceFolderTree } from '../../app/common/tests/mock'
import { setFolderTree, setCurrentFolderPath, setPathsArr } from '../../redux/reducers/foldersSlice'
import store from '../../redux/store/store'

describe('foldersSlice-reducer: ', () => {
  it('should set folderTree', async () => {
    await store.dispatch(setFolderTree(foldersSliceFolderTree))
    const state = store.getState()
    expect(state.foldersSliceReducer.folderTree[0].title)
      .toBe('main parent')
  })
  it('should set currentFolderPath', async () => {
    await store.dispatch(setCurrentFolderPath('home/path'))
    const state = store.getState()
    expect(state.foldersSliceReducer.currentFolderInfo.currentFolderPath)
      .toBe('home/path')
  })
  it('should set pathsArr', async () => {
    const folderPath = ['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']
    await store.dispatch(setPathsArr(folderPath))
    const state = store.getState()
    expect(getFolderReducerFolderPathsArr(state)[3])
      .toBe('/home')
  })
})
