import { createSelector } from 'reselect'
import { compose, map } from 'ramda'

import { RootState } from '../store/rootReducer'
import type { FieldsObj, UploadingObject } from '../types'
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
export const sort = (state: RootState) => state.mainPageReducer.sort
export const dOpenMenus = (state: RootState) => state.mainPageReducer.dOpenMenus
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
export const settings = (state: RootState) => state.settingSlice

export const pathsArrOptionsSelector = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))

export const openMenusSelector = createSelector(
  [
    openMenus,
    dOpenMenus,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (openMenus, dOpenMenus, { isMainPage, isUploadingPage }) => {
    const isMainPageOpenMenus = isMainPage && dOpenMenus
    const isUploadPageOpenMenus = isUploadingPage && openMenus

    return {
      openMenuKeys: isMainPageOpenMenus || isUploadPageOpenMenus || [],
    }
  }
)

export const isGlobalExifLoading = createSelector(
  main,
  upload,
  (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  (
    { isExifLoading: isExifLoadingMainPage },
    { isExifLoading: isExifLoadingUploadPage },
    { isMainPage, isUploadingPage }
  ) => {
    const isMainPageExifLoading = isMainPage && isExifLoadingMainPage
    const isUploadPageExifLoading = isUploadingPage && isExifLoadingUploadPage

    return {
      isExifLoading: isMainPageExifLoading || isUploadPageExifLoading || false,
    }
  }
)

export const currentFilesList = createSelector(
  [
    uploadingFiles,
    downloadingFiles,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (uploadingFiles, downloadingFiles, { isMainPage, isUploadingPage }): FieldsObj[] => {
    const mainPageFilesArr = isMainPage && downloadingFiles
    const uploadingPageFilesArr = isUploadingPage && uploadingFiles

    return mainPageFilesArr || uploadingPageFilesArr || []
  }
)

export const currentSelectedList = createSelector(
  [
    selectedList,
    dSelectedList,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (uploadedSelectedList, downloadedSelectedList, { isMainPage, isUploadingPage }) => {
    const mainPageSelectedList = isMainPage && downloadedSelectedList
    const uploadingPageSelectedList = isUploadingPage && uploadedSelectedList

    return mainPageSelectedList || uploadingPageSelectedList || []
  }
)

export const selectedFilesList = createSelector(
  [currentFilesList, currentSelectedList],
  (currentFilesList, currentSelectedList) => ({
    selectedFiles: currentSelectedList.map(index => currentFilesList[index]),
  })
)

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

export const uniqKeywords = createSelector(
  [
    allDownloadingKeywordsSelector,
    allUploadKeywordsSelector,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (allDownloadingKeywordsSelector, allUploadKeywordsSelector, { isMainPage, isUploadingPage }) => {
    const allDownloadingKeywords = isMainPage && allDownloadingKeywordsSelector
    const allUploadKeywords = isUploadingPage && allUploadKeywordsSelector

    return allDownloadingKeywords || allUploadKeywords || []
  }
)

export const allSameKeywordsSelector = createSelector(uploadingFiles, selectedList, (uploadingFiles, selectedList) =>
  getSameKeywords(uploadingFiles, selectedList)
)

export const dAllSameKeywordsSelector = createSelector(
  downloadingFiles,
  dSelectedList,
  (downloadingFiles, dSelectedList) => getSameKeywords(downloadingFiles, dSelectedList)
)

export const allSameKeywords = createSelector(
  [
    allSameKeywordsSelector,
    dAllSameKeywordsSelector,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (allSameKeywordsUpload, allSameKeywordsDownload, { isMainPage, isUploadingPage }) => {
    const mainPageSameKeywords = isMainPage && allSameKeywordsDownload
    const uploadingPageSameKeywords = isUploadingPage && allSameKeywordsUpload

    return mainPageSameKeywords || uploadingPageSameKeywords || []
  }
)

export const selectedDateList = createSelector(
  uploadingFiles,
  downloadingFiles,
  selectedList,
  dSelectedList,
  (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  (
    uploadingFiles,
    downloadingFiles,
    uploadingSelectedList,
    downloadingSelectedList,
    { isMainPage, isUploadingPage }
  ) => {
    const getDownloadingDateList = () =>
      downloadingSelectedList.map(selectedItem => ({
        originalDate: downloadingFiles[selectedItem].originalDate,
        changeDate: downloadingFiles[selectedItem].changeDate,
      }))

    const getUploadingDateList = () =>
      uploadingSelectedList.map(selectedItem => ({
        originalDate: uploadingFiles[selectedItem].originalDate,
        changeDate: uploadingFiles[selectedItem].changeDate,
      }))

    const mainPageDateList = isMainPage && getDownloadingDateList()
    const uploadPageList = isUploadingPage && getUploadingDateList()

    return mainPageDateList || uploadPageList || []
  }
)
