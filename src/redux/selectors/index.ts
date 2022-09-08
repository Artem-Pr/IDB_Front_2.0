import { createSelector } from 'reselect'
import { compose, map } from 'ramda'

import { RootState } from '../store/rootReducer'
import { UploadingObject } from '../types'
import { getSameKeywords, getUniqArr } from '../../app/common/utils'

export const folderElement = (state: RootState) => state.folderReducer
export const curFolderInfo = (state: RootState) => state.folderReducer.currentFolderInfo
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus
export const uploadingFiles = (state: RootState) => state.uploadReducer.uploadingFiles
export const uploadingBlobs = (state: RootState) => state.uploadReducer.uploadingBlobs
export const selectedList = (state: RootState) => state.uploadReducer.selectedList
export const main = (state: RootState) => state.mainPageReducer
export const searchMenu = (state: RootState) => state.mainPageReducer.searchMenu
export const downloadingFiles = (state: RootState) => state.mainPageReducer.downloadingFiles
export const dSelectedList = (state: RootState) => state.mainPageReducer.dSelectedList
export const pagination = (state: RootState) => state.mainPageReducer.galleryPagination
export const filesSizeSum = (state: RootState) => state.mainPageReducer.filesSizeSum
export const isDeleteProcessing = (state: RootState) => state.mainPageReducer.isDeleteProcessing
export const imagePreview = (state: RootState) => state.mainPageReducer.preview
export const numberOfFilesChecking = (state: RootState) => state.testsReducer.firstTest
export const videoFilesChecking = (state: RootState) => state.testsReducer.secondTest
export const pathsConfigRebuildProgress = (state: RootState) => state.testsReducer.thirdTest.progress
export const session = (state: RootState) => state.sessionSlice

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

export const allUploadKeywordsSelector = createSelector(uploadingFiles, uploadingFiles => {
  return compose(
    getUniqArr,
    map((item: UploadingObject) => item.keywords || [])
  )(uploadingFiles)
})

export const allDownloadingKeywordsSelector = createSelector(downloadingFiles, downloadingFiles => {
  return compose(
    getUniqArr,
    map((item: UploadingObject) => item.keywords || [])
  )(downloadingFiles)
})

export const allSameKeywordsSelector = createSelector(uploadingFiles, selectedList, (uploadingFiles, selectedList) => {
  return getSameKeywords(uploadingFiles, selectedList)
})

export const dAllSameKeywordsSelector = createSelector(
  downloadingFiles,
  dSelectedList,
  (downloadingFiles, dSelectedList) => {
    return getSameKeywords(downloadingFiles, dSelectedList)
  }
)
