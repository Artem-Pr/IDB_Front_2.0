import { configureStore } from '@reduxjs/toolkit'

import type { Media } from 'src/api/models/media'
import { foldersSliceReducer, folderReducerSetPathsArr } from 'src/redux/reducers/foldersSlice'
import { mainPageSliceReducer } from 'src/redux/reducers/mainPageSlice'
import { sessionSliceReducer, sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
import { settingsSliceReducer } from 'src/redux/reducers/settingsSlice'
import { testsSliceReducer } from 'src/redux/reducers/testsSlice'
import { uploadPageSliceReducer, uploadReducerSetFilesArr, uploadReducerSelectAll } from 'src/redux/reducers/uploadSlice'
import { getSameKeywords } from 'src/redux/selectors'
import { Paths } from 'src/routes/paths'

import { uploadingFilesWithKeywordsMock } from '../../app/common/tests/mock'
import { copyByJSON } from '../../app/common/utils'

// Helper function to create a complete test store matching RootState
const createTestStore = () => configureStore({
  reducer: {
    foldersSliceReducer,
    mainPageSliceReducer,
    sessionSliceReducer,
    settingsSliceReducer,
    testsSliceReducer,
    uploadPageSliceReducer,
  },
})

type TestStore = ReturnType<typeof createTestStore>

describe('selectors: ', () => {
  it('should return pathsArr', () => {
    const store: TestStore = createTestStore()
    
    store.dispatch(folderReducerSetPathsArr(['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']))
    const state = store.getState()
    
    expect(state.foldersSliceReducer.pathsArr[3])
      .toBe('/home')
  })

  it('should return pathsArrOptions', () => {
    const store: TestStore = createTestStore()
    
    store.dispatch(folderReducerSetPathsArr(['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']))
    const state = store.getState()
    const pathsOptions = state.foldersSliceReducer.pathsArr.map(path => ({ value: path }))
    
    expect(pathsOptions)
      .toHaveLength(4)
    expect(pathsOptions[3].value)
      .toBe('/home')
  })

  it('should return all keywords from uploaded files', () => {
    const store: TestStore = createTestStore()
    const uploadingFiles: Media[] = copyByJSON(uploadingFilesWithKeywordsMock)
    
    store.dispatch(uploadReducerSetFilesArr(uploadingFiles))
    const state = store.getState()
    
    // Extract keywords directly from the state
    const allKeywords = Array.from(new Set(
      state.uploadPageSliceReducer.filesArr
        .flatMap(file => file.keywords || [])
    ))
    
    expect(allKeywords)
      .toHaveLength(5)
    expect(allKeywords.includes('Озеро'))
      .toBeTruthy()
    expect(allKeywords.includes('Эстония'))
      .toBeTruthy()
    expect(allKeywords.includes('Оля'))
      .toBeTruthy()
    expect(allKeywords.includes('Карта'))
      .toBeTruthy()
    expect(allKeywords.includes('Велосипед'))
      .toBeTruthy()
  })

  it('should return intersected keywords using selector', () => {
    const store: TestStore = createTestStore()
    const uploadingFiles: Media[] = copyByJSON(uploadingFilesWithKeywordsMock)
    
    // Set up the store state to match what the selector expects
    store.dispatch(uploadReducerSetFilesArr(uploadingFiles))
    store.dispatch(sessionReducerSetCurrentPage(Paths.UPLOAD))
    store.dispatch(uploadReducerSelectAll())
    
    const state = store.getState()
    // Now test the actual Redux selector
    const intersectedKeywords = getSameKeywords(state)
    
    expect(intersectedKeywords)
      .toHaveLength(1)
    expect(intersectedKeywords.includes('Эстония'))
      .toBeTruthy()
  })
})
