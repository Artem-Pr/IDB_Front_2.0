/* eslint-disable functional/no-let */
import { setCurrentFolderPath, setFolderTree } from '../../redux/reducers/foldersSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree } from '../common/mock'
import { RootState } from '../../redux/store/rootReducer'
import { currentFolderPath, folderTree } from '../../redux/selectors'

describe('selectors: ', () => {
  let initialState: RootState

  beforeAll(() => {
    store.dispatch(setFolderTree(foldersSliceFolderTree))
    store.dispatch(setCurrentFolderPath('home/path'))
  })

  beforeEach(() => {
    initialState = store.getState()
  })

  it('should return folderTree', async function () {
    const children = folderTree(initialState)[1].children
    const returnedValue = children ? children[0].title : ''
    expect(returnedValue).toBe('leaf 1-0')
  })
  it('should return currentFolderPath', async function () {
    const path = currentFolderPath(initialState)
    expect(path).toBe('home/path')
  })
})
