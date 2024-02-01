/* eslint-disable @typescript-eslint/no-shadow */
import { copyByJSON } from '../../app/common/utils'
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import { selectAll, updateUploadingFilesArr } from '../../redux/reducers/uploadSlice'
import {
  allSameKeywordsSelector,
  allUploadKeywordsSelector,
  pathsArr,
  pathsArrOptionsSelector,
} from '../../redux/selectors'
import type { RootState } from '../../redux/store/rootReducer'
import store from '../../redux/store/store'
import { UploadingObject } from '../../redux/types'
import { foldersSliceFolderTree, uploadingFilesMock, uploadingFilesWithKeywordsMock } from '../common/mock'

describe('selectors: ', () => {
  let initialState: RootState = store.getState()

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
  it('should return pathsArr', async () => {
    const path = pathsArr(initialState)
    expect(path[3])
      .toBe('/home')
  })
  it('should return pathsArrOptions', async () => {
    const pathsOptions = pathsArrOptionsSelector(initialState)
    expect(pathsOptions)
      .toHaveLength(4)
    expect(pathsOptions[3].value)
      .toBe('/home')
  })
  it('should return all keywords', async () => {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesWithKeywordsMock)
    await store.dispatch(updateUploadingFilesArr(uploadingFiles))
    const initialState = store.getState()
    const allKeywords = allUploadKeywordsSelector(initialState)
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
  it('should return intersected keywords', async () => {
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesWithKeywordsMock)
    await store.dispatch(updateUploadingFilesArr(uploadingFiles))
    await store.dispatch(selectAll())
    const initialState = store.getState()
    const allKeywords = allSameKeywordsSelector(initialState)
    expect(allKeywords)
      .toHaveLength(1)
    expect(allKeywords.includes('Эстония'))
      .toBeTruthy()
  })
})
