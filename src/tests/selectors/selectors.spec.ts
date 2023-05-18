/* eslint-disable functional/no-let */
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import { selectAll, updateUploadingFilesArr } from '../../redux/reducers/uploadSlice'
import store from '../../redux/store/store'
import { foldersSliceFolderTree, uploadingFilesMock, uploadingFilesWithKeywordsMock } from '../common/mock'
import { RootState } from '../../redux/store/rootReducer'
import {
  allSameKeywordsSelector,
  allUploadKeywordsSelector,
  pathsArr,
  pathsArrOptionsSelector,
} from '../../redux/selectors'
import { copyByJSON } from '../../app/common/utils'
import { UploadingObject } from '../../redux/types'

describe('selectors: ', () => {
  let initialState: RootState

  beforeAll(() => {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesMock)
    store.dispatch(updateUploadingFilesArr(uploadingFiles))
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
  it('should return all keywords', async function () {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesWithKeywordsMock)
    await store.dispatch(updateUploadingFilesArr(uploadingFiles))
    const initialState = store.getState()
    const allKeywords = allUploadKeywordsSelector(initialState)
    expect(allKeywords).toHaveLength(5)
    expect(allKeywords.includes('Озеро')).toBeTruthy()
    expect(allKeywords.includes('Эстония')).toBeTruthy()
    expect(allKeywords.includes('Оля')).toBeTruthy()
    expect(allKeywords.includes('Карта')).toBeTruthy()
    expect(allKeywords.includes('Велосипед')).toBeTruthy()
  })
  it('should return intersected keywords', async function () {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesWithKeywordsMock)
    await store.dispatch(updateUploadingFilesArr(uploadingFiles))
    await store.dispatch(selectAll())
    const initialState = store.getState()
    const allKeywords = allSameKeywordsSelector(initialState)
    expect(allKeywords).toHaveLength(1)
    expect(allKeywords.includes('Эстония')).toBeTruthy()
  })
})
