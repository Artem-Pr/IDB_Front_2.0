import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { MainMenuKeys } from 'src/common/constants'

import { getFolderReducerFolderInfoCurrentFolder } from '../reducers/foldersSlice/selectors'
import {
  getMainPageReducerKeywords,
  getMainPageReducerOpenMenus,
  getMainPageReducerFilesArr,
  getMainPageReducerPreviewDuplicates,
  getMainPageReducerSelectedList,
  getMainPageReducerImagePreview,
  getMainPageReducerSort,
  getMainPageReducerSameKeywords,
} from '../reducers/mainPageSlice/selectors'
import { getSessionReducerIsCurrentPage } from '../reducers/sessionSlice/selectors'
import {
  getUploadReducerSameKeywords,
  getUploadReducerKeywords,
  getUploadReducerCheckDuplicatesInCurrentDir,
  getUploadReducerOpenMenus,
  getUploadReducerSelectedList,
  getUploadReducerFilesArr,
  getUploadReducerSort,
} from '../reducers/uploadSlice/selectors'
import type { SortingData } from '../types'

export const getSort = createSelector(
  [
    getUploadReducerSort,
    getMainPageReducerSort,
    getSessionReducerIsCurrentPage,
  ],
  (uploadPageSortingData, mainPageSortingData, { isMainPage, isUploadPage }): SortingData => {
    if (isMainPage) return mainPageSortingData
    if (isUploadPage) return uploadPageSortingData
    return { gallerySortingList: [], groupedByDate: false }
  },
)

export const getUploadDuplicateFilesArr = createSelector(
  [
    getUploadReducerFilesArr,
    getUploadReducerCheckDuplicatesInCurrentDir,
    getFolderReducerFolderInfoCurrentFolder,
  ],
  (uploadingFilesArr, onlyDuplicatesInCurrentFolder, currentFolderPath): DuplicateFile[] => uploadingFilesArr
    .reduce<DuplicateFile[]>((accum, { duplicates = [] }) => [...accum, ...duplicates], [])
    .filter(({ filePath }) => (onlyDuplicatesInCurrentFolder ? filePath?.startsWith(`/${currentFolderPath}`) : true)),
)

export const getUploadPreviewDuplicates = createSelector(
  [getUploadDuplicateFilesArr, getMainPageReducerImagePreview],
  (duplicates, preview): DuplicateFile[] => (
    duplicates.filter(({ originalName }) => originalName === preview.originalName)),
)

export const getPreviewDuplicates = createSelector(
  [
    getUploadPreviewDuplicates,
    getMainPageReducerPreviewDuplicates,
    getSessionReducerIsCurrentPage,
  ],
  (uploadDuplicates, downloadDuplicates, { isMainPage, isUploadPage }): DuplicateFile[] => {
    if (isMainPage) return downloadDuplicates
    if (isUploadPage) return uploadDuplicates
    return []
  },
)

export const getOpenMenus = createSelector(
  [
    getUploadReducerOpenMenus,
    getMainPageReducerOpenMenus,
    getSessionReducerIsCurrentPage,
  ],
  (uploadOpenMenuKeys, downloadPageOpenMenus, { isMainPage, isUploadPage }): MainMenuKeys[] => {
    if (isMainPage) return downloadPageOpenMenus
    if (isUploadPage) return uploadOpenMenuKeys
    return []
  },
)

export const getCurrentFilesArr = createSelector(
  [
    getUploadReducerFilesArr,
    getMainPageReducerFilesArr,
    getSessionReducerIsCurrentPage,
  ],
  (uploadingFilesArr, downloadingFilesArr, { isMainPage, isUploadPage }): Media[] => {
    if (isMainPage) return downloadingFilesArr
    if (isUploadPage) return uploadingFilesArr
    return []
  },
)

export const getCurrentSelectedList = createSelector(
  [
    getUploadReducerSelectedList,
    getMainPageReducerSelectedList,
    getSessionReducerIsCurrentPage,
  ],
  (uploadedSelectedList, downloadedSelectedList, { isMainPage, isUploadPage }): number[] => {
    if (isMainPage) return downloadedSelectedList
    if (isUploadPage) return uploadedSelectedList
    return []
  },
)

export const getSelectedFilesArr = createSelector(
  [getCurrentFilesArr, getCurrentSelectedList],
  (currentFiles, currentSelectedArr): Media[] => currentSelectedArr.map(index => currentFiles[index]),
)

export const getUniqKeywords = createSelector(
  [
    getMainPageReducerKeywords,
    getUploadReducerKeywords,
    getSessionReducerIsCurrentPage,
  ],
  (allDownloadingKeywords, allUploadKeywords, { isMainPage, isUploadPage }): string[] => {
    if (isMainPage) return allDownloadingKeywords
    if (isUploadPage) return allUploadKeywords
    return []
  },
)

export const getSameKeywords = createSelector(
  [
    getUploadReducerSameKeywords,
    getMainPageReducerSameKeywords,
    getSessionReducerIsCurrentPage,
  ],
  (allSameKeywordsUpload, allSameKeywordsDownload, { isMainPage, isUploadPage }): string[] => {
    if (isMainPage) return allSameKeywordsDownload
    if (isUploadPage) return allSameKeywordsUpload
    return []
  },
)

export const getSelectedDateList = createSelector(
  getUploadReducerFilesArr,
  getMainPageReducerFilesArr,
  getUploadReducerSelectedList,
  getMainPageReducerSelectedList,
  getSessionReducerIsCurrentPage,
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
