import { compose, map } from 'ramda'
import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { getUpdatedPathsArrFromMediaList } from 'src/app/common/folderTree'
import { MainMenuKeys, PagePaths } from 'src/common/constants'

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
export const globalLoader = (state: RootState) => state.settingSlice.globalLoader
export const currentPage = (state: RootState) => state.sessionSlice.currentPage

export const getIsCurrentPage = createSelector(
  currentPage,
  currentPageName => ({
    isMainPage: currentPageName === PagePaths.MAIN,
    isUploadPage: currentPageName === PagePaths.UPLOAD,
  }),
)

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
    currentPage,
  ],
  (uploadPageSortingData, mainPageSortingData, currentPageName): SortingData => {
    if (currentPageName === PagePaths.MAIN) return mainPageSortingData
    if (currentPageName === PagePaths.UPLOAD) return uploadPageSortingData
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
    currentPage,
  ],
  (uploadOpenMenuKeys, downloadPageOpenMenus, currentPageName): MainMenuKeys[] => {
    if (currentPageName === PagePaths.MAIN) return downloadPageOpenMenus
    if (currentPageName === PagePaths.UPLOAD) return uploadOpenMenuKeys
    return []
  },
)

export const hasFailedUploadingFiles = createSelector(uploadingFiles, uploadingFilesArr => (
  uploadingFilesArr.some(({ staticPath }) => !staticPath)
))

export const currentFilesList = createSelector(
  [
    uploadingFiles,
    downloadingFiles,
    currentPage,
  ],
  (uploadingFilesArr, downloadingFilesArr, currentPageName): Media[] => {
    if (currentPageName === PagePaths.MAIN) return downloadingFilesArr
    if (currentPageName === PagePaths.UPLOAD) return uploadingFilesArr
    return []
  },
)

export const currentSelectedList = createSelector(
  [
    selectedList,
    dSelectedList,
    currentPage,
  ],
  (uploadedSelectedList, downloadedSelectedList, currentPageName): number[] => {
    if (currentPageName === PagePaths.MAIN) return downloadedSelectedList
    if (currentPageName === PagePaths.UPLOAD) return uploadedSelectedList
    return []
  },
)

export const selectedFilesList = createSelector(
  [currentFilesList, currentSelectedList],
  (currentFiles, currentSelectedArr): Media[] => currentSelectedArr.map(index => currentFiles[index]),
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
    currentPage,
  ],
  (allDownloadingKeywords, allUploadKeywords, currentPageName): string[] => {
    if (currentPageName === PagePaths.MAIN) return allDownloadingKeywords
    if (currentPageName === PagePaths.UPLOAD) return allUploadKeywords
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
    currentPage,
  ],
  (allSameKeywordsUpload, allSameKeywordsDownload, currentPageName): string[] => {
    if (currentPageName === PagePaths.MAIN) return allSameKeywordsDownload
    if (currentPageName === PagePaths.UPLOAD) return allSameKeywordsUpload
    return []
  },
)

export const selectedDateList = createSelector(
  uploadingFiles,
  downloadingFiles,
  selectedList,
  dSelectedList,
  currentPage,
  (
    uploadingFilesArr,
    downloadingFilesArr,
    uploadingSelectedList,
    downloadingSelectedList,
    currentPageName,
  ): {
    originalDate: string
    changeDate: string | null
  }[] => {
    const getDownloadingDateList = () => downloadingSelectedList.map(selectedItem => ({
      originalDate: downloadingFilesArr[selectedItem].originalDate,
      changeDate: downloadingFilesArr[selectedItem].changeDate,
    }))

    const getUploadingDateList = () => uploadingSelectedList.map(selectedItem => ({
      originalDate: uploadingFilesArr[selectedItem].originalDate,
      changeDate: uploadingFilesArr[selectedItem].changeDate,
    }))

    if (currentPageName === PagePaths.MAIN) return getDownloadingDateList()
    if (currentPageName === PagePaths.UPLOAD) return getUploadingDateList()
    return []
  },
)
