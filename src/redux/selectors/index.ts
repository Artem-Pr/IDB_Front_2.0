import { createSelector } from 'reselect'
import { compose, map, reduce, union } from 'ramda'

import { RootState } from '../store/rootReducer'
import { UploadingObject } from '../types'
import { getSameKeywords } from '../../app/common/utils'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus
export const uploadingFiles = (state: RootState) => state.uploadReducer.uploadingFiles
export const selectedList = (state: RootState) => state.uploadReducer.selectedList
export const main = (state: RootState) => state.mainPageReducer
export const downloadingFiles = (state: RootState) => state.mainPageReducer.downloadingFiles
export const dSelectedList = (state: RootState) => state.mainPageReducer.dSelectedList

export const pathsArrOptionsSelector = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))

export const uploadPageGalleryPropsSelector = createSelector(
  upload,
  ({ uploadingFiles, selectedList, openMenus, fullExifFilesList }) => ({
    openMenus,
    selectedList,
    fullExifFilesList,
    imageArr: uploadingFiles,
  })
)

export const dPageGalleryPropsSelector = createSelector(
  main,
  upload,
  ({ downloadingFiles, dSelectedList, dOpenMenus }, { fullExifFilesList }) => ({
    openMenus: dOpenMenus,
    selectedList: dSelectedList,
    fullExifFilesList,
    imageArr: downloadingFiles,
  })
)

//Todo: get rid of duplicated code
export const allUploadKeywords = createSelector(uploadingFiles, uploadingFiles => {
  const getUniqArr = (keywordsArrays: string[][]) => reduce<string[], string[]>(union, [], keywordsArrays)
  return compose(
    getUniqArr,
    map((item: UploadingObject) => item.keywords || [])
  )(uploadingFiles)
})

export const allDownloadingKeywords = createSelector(downloadingFiles, downloadingFiles => {
  const getUniqArr = (keywordsArrays: string[][]) => reduce<string[], string[]>(union, [], keywordsArrays)
  return compose(
    getUniqArr,
    map((item: UploadingObject) => item.keywords || [])
  )(downloadingFiles)
})

export const allSameKeywords = createSelector(uploadingFiles, selectedList, (uploadingFiles, selectedList) => {
  return getSameKeywords(uploadingFiles, selectedList)
})

export const dAllSameKeywords = createSelector(downloadingFiles, dSelectedList, (downloadingFiles, dSelectedList) => {
  return getSameKeywords(downloadingFiles, dSelectedList)
})
