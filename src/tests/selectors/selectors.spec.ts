import type { Media } from 'src/api/models/media'
import { PagePaths } from 'src/common/constants'
import { getFolderReducerFolderPathsArr, getFolderReducerPathsArrOptionsSelector } from 'src/redux/reducers/foldersSlice/selectors'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
import { getUploadReducerKeywords } from 'src/redux/reducers/uploadSlice/selectors'
import { getSameKeywords } from 'src/redux/selectors'

import { foldersSliceFolderTree, uploadingFilesMock, uploadingFilesWithKeywordsMock } from '../../app/common/tests/mock'
import { copyByJSON } from '../../app/common/utils'
import { folderReducerSetCurrentFolderPath, folderReducerSetFolderTree, folderReducerSetPathsArr } from '../../redux/reducers/foldersSlice'
import { uploadReducerSelectAll, uploadReducerSetFilesArr } from '../../redux/reducers/uploadSlice'
import store from '../../redux/store/store'
import type { RootState } from '../../redux/store/types'

describe('selectors: ', () => {
  let initialState: RootState = store.getState()

  beforeAll(() => {
    const uploadingFiles: Media[] = copyByJSON(uploadingFilesMock)
    store.dispatch(uploadReducerSetFilesArr(uploadingFiles))
    store.dispatch(folderReducerSetFolderTree(foldersSliceFolderTree))
    store.dispatch(folderReducerSetCurrentFolderPath('home/path'))
    store.dispatch(folderReducerSetPathsArr(['/', '/folder1/Bom-bom', '/folder2/Bom/sdf', '/home']))
  })

  beforeEach(() => {
    initialState = store.getState()
  })
  it('should return pathsArr', async () => {
    const path = getFolderReducerFolderPathsArr(initialState)
    expect(path[3])
      .toBe('/home')
  })
  it('should return pathsArrOptions', async () => {
    const pathsOptions = getFolderReducerPathsArrOptionsSelector(initialState)
    expect(pathsOptions)
      .toHaveLength(4)
    expect(pathsOptions[3].value)
      .toBe('/home')
  })
  it('should return all keywords', async () => {
    const uploadingFiles: Media[] = copyByJSON(uploadingFilesWithKeywordsMock)
    await store.dispatch(uploadReducerSetFilesArr(uploadingFiles))
    const initialState = store.getState()
    const allKeywords = getUploadReducerKeywords(initialState)
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
    const uploadingFiles: Media[] = copyByJSON(uploadingFilesWithKeywordsMock)
    store.dispatch(uploadReducerSetFilesArr(uploadingFiles))
    store.dispatch(sessionReducerSetCurrentPage(PagePaths.UPLOAD))
    store.dispatch(uploadReducerSelectAll())
    const initialState = store.getState()
    const allKeywords = getSameKeywords(initialState)
    expect(allKeywords)
      .toHaveLength(1)
    expect(allKeywords.includes('Эстония'))
      .toBeTruthy()
  })
})
