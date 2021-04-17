/* eslint-disable functional/no-let */
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree } from '../common/mock'
import { RootState } from '../../redux/store/rootReducer'
import { currentFolderPath, folderTree, pathsArr, pathsArrOptions } from '../../redux/selectors'

describe('selectors: ', () => {
  let initialState: RootState

  beforeAll(() => {
    store.dispatch(setFolderTree(foldersSliceFolderTree))
    store.dispatch(setCurrentFolderPath('home/path'))
    store.dispatch(setPathsArr(['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']))
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
  it('should return pathsArr', async function () {
    const path = pathsArr(initialState)
    expect(path[3]).toBe('/home')
  })
  it('should return pathsArrOptions', async function () {
    const pathsOptions = pathsArrOptions(initialState)
    expect(pathsOptions).toHaveLength(4)
    expect(pathsOptions[3].value).toBe('/home')
  })
})
