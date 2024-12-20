import { compose, map } from 'ramda'
import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { getUpdatedPathsArrFromMediaList } from 'src/app/common/folderTree'

import { getSameKeywords, getUniqArr } from '../../app/common/utils'
import type { RootState } from '../store/types'
import type { SortingData } from '../types'

export const folderElement = (state: RootState) => state.folderReducer
export const folderInfoShowInfoModal = (state: RootState) => state.folderReducer.currentFolderInfo.showInfoModal
export const folderInfoNumberOfFiles = (state: RootState) => state.folderReducer.currentFolderInfo.numberOfFiles
export const folderInfoNumberOfSubdirs = (state: RootState) => state.folderReducer.currentFolderInfo.numberOfSubdirectories
export const folderInfoCurrentFolder = (state: RootState) => state.folderReducer.currentFolderInfo.currentFolderPath
export const folderInfoShowSubfolders = (state: RootState) => state.folderReducer.currentFolderInfo.showSubfolders
export const folderInfoIsDynamicFolders = (state: RootState) => state.folderReducer.currentFolderInfo.isDynamicFolders
export const folderInfoCurrentFolderKey = (state: RootState) => state.folderReducer.currentFolderInfo.currentFolderKey
export const folderInfoExpandedKeys = (state: RootState) => state.folderReducer.currentFolderInfo.expandedKeys
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus
export const uploadingFiles = (state: RootState) => state.uploadReducer.uploadingFiles
export const uploadingBlobs = (state: RootState) => state.uploadReducer.uploadingBlobs
export const selectedList = (state: RootState) => state.uploadReducer.selectedList
export const uploadPageSort = (state: RootState) => state.uploadReducer.sort
export const checkForDuplicatesOnlyInCurrentFolder = (state: RootState) => (
  state.uploadReducer.checkForDuplicatesOnlyInCurrentFolder
)
export const main = (state: RootState) => state.mainPageReducer
export const mainPageSort = (state: RootState) => state.mainPageReducer.sort
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
export const session = (state: RootState) => state.sessionSlice
export const settings = (state: RootState) => state.settingSlice

export const updatedPathsArrFromMediaList = createSelector([
  pathsArr,
  (_state: RootState, mediaList: Media[]) => mediaList,
], (actualPathsArr, mediaList) => (
  getUpdatedPathsArrFromMediaList(mediaList, actualPathsArr)
))

export const pathsArrOptionsSelector = createSelector(pathsArr, pathsArrSelector => (
  pathsArrSelector
    .map(path => ({ value: path }))
))

export const sort = createSelector(
  [
    uploadPageSort,
    mainPageSort,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (uploadPageSortingData, mainPageSortingData, { isMainPage, isUploadingPage }): SortingData => {
    if (isMainPage) return mainPageSortingData
    if (isUploadingPage) return uploadPageSortingData
    return { gallerySortingList: [], groupedByDate: false }
  },
)

export const duplicateFilesArr = createSelector(
  [uploadingFiles, checkForDuplicatesOnlyInCurrentFolder, folderInfoCurrentFolder],
  (uploadingFilesArr, onlyDuplicatesInCurrentFolder, currentFolderPath) => uploadingFilesArr
    .reduce<DuplicateFile[]>((accum, { duplicates = [] }) => [...accum, ...duplicates], [])
    .filter(({ filePath }) => (onlyDuplicatesInCurrentFolder ? filePath?.startsWith(`/${currentFolderPath}`) : true)),
)

export const previewDuplicates = createSelector(
  [duplicateFilesArr, imagePreview],
  (duplicates, preview) => (
    duplicates.filter(({ originalName }) => originalName === preview.originalName)),
)

export const openMenusSelector = createSelector(
  [
    openMenus,
    dOpenMenus,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (openMenuKeys, downloadPageOpenMenus, { isMainPage, isUploadingPage }) => {
    const mainPageOpenMenus = isMainPage && downloadPageOpenMenus
    const uploadPageOpenMenus = isUploadingPage && openMenuKeys

    return {
      openMenuKeys: mainPageOpenMenus || uploadPageOpenMenus || [],
    }
  },
)

export const hasFailedUploadingFiles = createSelector(uploadingFiles, uploadingFilesArr => (
  uploadingFilesArr.some(({ staticPath }) => !staticPath)
))

export const currentFilesList = createSelector(
  [
    uploadingFiles,
    downloadingFiles,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (uploadingFilesArr, downloadingFilesArr, { isMainPage, isUploadingPage }): Media[] => {
    const mainPageFilesArr = isMainPage && downloadingFilesArr
    const uploadingPageFilesArr = isUploadingPage && uploadingFilesArr

    return mainPageFilesArr || uploadingPageFilesArr || []
  },
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
  },
)

export const selectedFilesList = createSelector(
  [currentFilesList, currentSelectedList],
  (currentFiles, currentSelectedArr) => ({
    selectedFiles: currentSelectedArr.map(index => currentFiles[index]),
  }),
)

export const uploadPageGalleryPropsSelector = createSelector(
  upload,
  uploadState => ({
    imageArr: uploadState.uploadingFiles,
    openMenus: uploadState.openMenus,
    selectedList: uploadState.selectedList,
  }),
)

export const dPageGalleryPropsSelector = createSelector(
  main,
  mainPageState => ({
    imageArr: mainPageState.downloadingFiles,
    openMenus: mainPageState.dOpenMenus,
    selectedList: mainPageState.dSelectedList,
  }),
)

export const allUploadKeywordsSelector = createSelector(uploadingFiles, uploadingFilesArr => compose(
  getUniqArr,
  map((item: Media) => item.keywords || []),
)(uploadingFilesArr))

export const allDownloadingKeywordsSelector = createSelector(downloadingFiles, downloadingFilesArr => compose(
  getUniqArr,
  map((item: Media) => item.keywords || []),
)(downloadingFilesArr))

export const uniqKeywords = createSelector(
  [
    allDownloadingKeywordsSelector,
    allUploadKeywordsSelector,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (allDownloadingKeywords, allUploadKeywords, { isMainPage, isUploadingPage }) => {
    if (isMainPage) return allDownloadingKeywords
    if (isUploadingPage) return allUploadKeywords
    return []
  },
)

export const allSameKeywordsSelector = createSelector(
  [uploadingFiles, selectedList],
  (uploadingFilesArr, uploadingSelectedList) => getSameKeywords(uploadingFilesArr, uploadingSelectedList),
)

export const dAllSameKeywordsSelector = createSelector(
  downloadingFiles,
  dSelectedList,
  (downloadingFilesArr, mainPageSelectedList) => getSameKeywords(downloadingFilesArr, mainPageSelectedList),
)

export const allSameKeywords = createSelector(
  [
    allSameKeywordsSelector,
    dAllSameKeywordsSelector,
    (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  ],
  (allSameKeywordsUpload, allSameKeywordsDownload, { isMainPage, isUploadingPage }) => {
    if (isMainPage) return allSameKeywordsDownload
    if (isUploadingPage) return allSameKeywordsUpload
    return []
  },
)

export const selectedDateList = createSelector(
  uploadingFiles,
  downloadingFiles,
  selectedList,
  dSelectedList,
  (_state: RootState, currentPage: { isMainPage: boolean; isUploadingPage: boolean }) => currentPage,
  (
    uploadingFilesArr,
    downloadingFilesArr,
    uploadingSelectedList,
    downloadingSelectedList,
    { isMainPage, isUploadingPage },
  ) => {
    const getDownloadingDateList = () => downloadingSelectedList.map(selectedItem => ({
      originalDate: downloadingFilesArr[selectedItem].originalDate,
      changeDate: downloadingFilesArr[selectedItem].changeDate,
    }))

    const getUploadingDateList = () => uploadingSelectedList.map(selectedItem => ({
      originalDate: uploadingFilesArr[selectedItem].originalDate,
      changeDate: uploadingFilesArr[selectedItem].changeDate,
    }))

    const mainPageDateList = isMainPage && getDownloadingDateList()
    const uploadPageList = isUploadingPage && getUploadingDateList()

    return mainPageDateList || uploadPageList || []
  },
)
