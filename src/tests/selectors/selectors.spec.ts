/* eslint-disable functional/no-let */
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import { addUploadingFile } from '../../redux/reducers/uploadSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree, uploadingFilesMock } from '../common/mock'
import { RootState } from '../../redux/store/rootReducer'
import { pathsArr, pathsArrOptionsSelector } from '../../redux/selectors'
import { copyByJSON } from '../../app/common/utils'
import { UploadingObject } from '../../redux/types'

describe('selectors: ', () => {
  let initialState: RootState

  beforeAll(() => {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesMock)
    uploadingFiles.forEach(item => store.dispatch(addUploadingFile(item)))
    store.dispatch(setFolderTree(foldersSliceFolderTree))
    store.dispatch(setCurrentFolderPath('home/path'))
    store.dispatch(setPathsArr(['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']))
  })

  beforeEach(() => {
    initialState = store.getState()
  })
  it('should return pathsArr', async function () {
    const path = pathsArr(initialState)
    expect(path[3]).toBe('/home')
  })
  it('should return pathsArrOptions', async function () {
    const pathsOptions = pathsArrOptionsSelector(initialState)
    expect(pathsOptions).toHaveLength(4)
    expect(pathsOptions[3].value).toBe('/home')
  })
  // it('should return selectedElement', async function () {
  //   const selectedList: number[] = [1]
  //   selectedList.forEach(item => store.dispatch(addToSelectedList(item)))
  //   await Promise.all(selectedList)
  //   const state = store.getState()
  //   const selectedElementsMap: Map<number, UploadingObject> = selectedElementsSelector(state)
  //   expect(selectedElementsMap.size).toBe(1)
  //   expect(selectedElementsMap.has(1)).toBeTruthy()
  //   expect(selectedElementsMap.get(1)?.originalDate).toBe('-')
  // })
  // it('should return selectedElements arr', async function () {
  //   const selectedList: number[] = [1, 2]
  //   selectedList.forEach(item => store.dispatch(addToSelectedList(item)))
  //   await Promise.all(selectedList)
  //   const state = store.getState()
  //   const selectedElementsMap: Map<number, UploadingObject> = selectedElementsSelector(state)
  //   expect(selectedElementsMap.size).toBe(2)
  //   expect(selectedElementsMap.has(1)).toBeTruthy()
  //   expect(selectedElementsMap.has(2)).toBeTruthy()
  //   expect(selectedElementsMap.get(1)?.originalDate).toBe('-')
  //   expect(selectedElementsMap.get(2)?.originalDate).toBe('24.09.2016')
  // })
})
