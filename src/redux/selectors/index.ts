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

export const sessionFitContain = (state: RootState) => state.sessionSlice.fitContain
export const sessionPreviewSize = (state: RootState) => state.sessionSlice.previewSize
export const sessionIsTimesDifferenceApplied = (state: RootState) => state.sessionSlice.isTimesDifferenceApplied
export const sessionIsLoading = (state: RootState) => state.sessionSlice.isLoading
export const sessionAsideMenuWidth = (state: RootState) => state.sessionSlice.asideMenuWidth
export const sessionCurrentPage = (state: RootState) => state.sessionSlice.currentPage
export const sessionIsDuplicatesChecking = (state: RootState) => state.sessionSlice.isDuplicatesChecking

export const settings = (state: RootState) => state.settingSlice
export const globalLoader = (state: RootState) => state.settingSlice.globalLoader

export const getIsCurrentPage = createSelector(
  sessionCurrentPage,
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
    getIsCurrentPage,
  ],
  (uploadPageSortingData, mainPageSortingData, { isMainPage, isUploadPage }): SortingData => {
    if (isMainPage) return mainPageSortingData
    if (isUploadPage) return uploadPageSortingData
    return { gallerySortingList: [], groupedByDate: false }
  },
)

export const uploadDuplicateFilesArr = createSelector(
  [uploadingFiles, checkForDuplicatesOnlyInCurrentFolder, folderInfoCurrentFolder],
  (uploadingFilesArr, onlyDuplicatesInCurrentFolder, currentFolderPath): DuplicateFile[] => uploadingFilesArr
    .reduce<DuplicateFile[]>((accum, { duplicates = [] }) => [...accum, ...duplicates], [])
    .filter(({ filePath }) => (onlyDuplicatesInCurrentFolder ? filePath?.startsWith(`/${currentFolderPath}`) : true)),
)

export const downloadDuplicateFilesArr = createSelector(
  downloadingFiles,
  (downloadingFilesArr): DuplicateFile[] => downloadingFilesArr
    .reduce<DuplicateFile[]>((accum, { duplicates = [] }) => [...accum, ...duplicates], []),
)

export const uploadPreviewDuplicates = createSelector(
  [uploadDuplicateFilesArr, imagePreview],
  (duplicates, preview): DuplicateFile[] => (
    duplicates.filter(({ originalName }) => originalName === preview.originalName)),
)

export const downloadPreviewDuplicates = createSelector(
  [downloadDuplicateFilesArr, imagePreview],
  (duplicates, preview): DuplicateFile[] => (
    duplicates.filter(({ originalName }) => originalName === preview.originalName)),
)

export const previewDuplicates = createSelector(
  [uploadPreviewDuplicates, downloadPreviewDuplicates, getIsCurrentPage],
  (uploadDuplicates, downloadDuplicates, { isMainPage, isUploadPage }): DuplicateFile[] => {
    if (isMainPage) return downloadDuplicates
    if (isUploadPage) return uploadDuplicates
    return []
  },
)

export const openMenusSelector = createSelector(
  [
    openMenus,
    dOpenMenus,
    getIsCurrentPage,
  ],
  (uploadOpenMenuKeys, downloadPageOpenMenus, { isMainPage, isUploadPage }): MainMenuKeys[] => {
    if (isMainPage) return downloadPageOpenMenus
    if (isUploadPage) return uploadOpenMenuKeys
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
    getIsCurrentPage,
  ],
  (uploadingFilesArr, downloadingFilesArr, { isMainPage, isUploadPage }): Media[] => {
    if (isMainPage) return downloadingFilesArr
    if (isUploadPage) return uploadingFilesArr
    return []
  },
)

export const currentSelectedList = createSelector(
  [
    selectedList,
    dSelectedList,
    getIsCurrentPage,
  ],
  (uploadedSelectedList, downloadedSelectedList, { isMainPage, isUploadPage }): number[] => {
    if (isMainPage) return downloadedSelectedList
    if (isUploadPage) return uploadedSelectedList
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
    getIsCurrentPage,
  ],
  (allDownloadingKeywords, allUploadKeywords, { isMainPage, isUploadPage }): string[] => {
    if (isMainPage) return allDownloadingKeywords
    if (isUploadPage) return allUploadKeywords
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
    getIsCurrentPage,
  ],
  (allSameKeywordsUpload, allSameKeywordsDownload, { isMainPage, isUploadPage }): string[] => {
    if (isMainPage) return allSameKeywordsDownload
    if (isUploadPage) return allSameKeywordsUpload
    return []
  },
)

export const selectedDateList = createSelector(
  uploadingFiles,
  downloadingFiles,
  selectedList,
  dSelectedList,
  getIsCurrentPage,
  (
    uploadingFilesArr,
    downloadingFilesArr,
    uploadingSelectedList,
    downloadingSelectedList,
    { isMainPage, isUploadPage },
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

    if (isMainPage) return getDownloadingDateList()
    if (isUploadPage) return getUploadingDateList()
    return []
  },
)
