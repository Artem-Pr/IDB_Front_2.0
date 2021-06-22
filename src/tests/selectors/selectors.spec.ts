/* eslint-disable functional/no-let */
import { setCurrentFolderPath, setFolderTree, setPathsArr } from '../../redux/reducers/foldersSlice-reducer'
import { addFullExifFile, addUploadingFile } from '../../redux/reducers/uploadSlice-reducer'
import store from '../../redux/store/store'
import { foldersSliceFolderTree, uploadingFilesMock, fullExifObjArr } from '../common/mock'
import { RootState } from '../../redux/store/rootReducer'
import { allUploadKeywords, pathsArr, pathsArrOptionsSelector } from '../../redux/selectors'
import { copyByJSON } from '../../app/common/utils'
import { FullExifObj, UploadingObject } from '../../redux/types'

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
  it('should return all keywords', async function () {
    const fullExifObjArrOriginal = fullExifObjArr
    const uploadingFiles: UploadingObject[] = copyByJSON(uploadingFilesMock)
    const fullExifArr: FullExifObj[] = copyByJSON(fullExifObjArrOriginal)
    const promises = uploadingFiles.map(({ tempPath }, i) =>
      store.dispatch(
        addFullExifFile({
          tempPath,
          fullExifObj: fullExifArr[i],
        })
      )
    )
    await Promise.all(promises)
    const initialState = store.getState()
    const allKeywords = allUploadKeywords(initialState)
    expect(allKeywords).toHaveLength(5)
    expect(allKeywords.includes('Озеро')).toBeTruthy()
    expect(allKeywords.includes('Эстония')).toBeTruthy()
    expect(allKeywords.includes('Оля')).toBeTruthy()
    expect(allKeywords.includes('Карта')).toBeTruthy()
    expect(allKeywords.includes('Велосипед')).toBeTruthy()
  })
})
