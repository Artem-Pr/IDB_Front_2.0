import { configureStore } from '@reduxjs/toolkit'

import { foldersSliceReducer, folderReducerSetFolderTree, folderReducerSetCurrentFolderPath, folderReducerSetPathsArr } from 'src/redux/reducers/foldersSlice'

import { foldersSliceFolderTree } from '../../app/common/tests/mock'

// Helper function to create a test store
const createTestStore = () => configureStore({
  reducer: {
    foldersSliceReducer,
  },
})

type TestStore = ReturnType<typeof createTestStore>

describe('foldersSlice-reducer: ', () => {
  it('should set folderTree', () => {
    const store: TestStore = createTestStore()
    
    store.dispatch(folderReducerSetFolderTree(foldersSliceFolderTree))
    const state = store.getState()
    
    expect(state.foldersSliceReducer.folderTree[0].title)
      .toBe('main parent')
  })

  it('should set currentFolderPath', () => {
    const store: TestStore = createTestStore()
    
    store.dispatch(folderReducerSetCurrentFolderPath('home/path'))
    const state = store.getState()
    
    expect(state.foldersSliceReducer.currentFolderInfo.currentFolderPath)
      .toBe('home/path')
  })

  it('should set pathsArr', () => {
    const store: TestStore = createTestStore()
    const folderPath = ['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']
    
    store.dispatch(folderReducerSetPathsArr(folderPath))
    const state = store.getState()
    
    expect(state.foldersSliceReducer.pathsArr[3])
      .toBe('/home')
  })
})
