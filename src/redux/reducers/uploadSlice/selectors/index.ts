import { compose, map } from 'ramda'
import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import { getUniqArr } from 'src/app/common/utils'
import type { RootState } from 'src/redux/store/types'

export const getUploadReducerPreviewLoadingCount = (state: RootState) => state.uploadPageSliceReducer.previewLoadingCount
export const getUploadReducerBlobs = (state: RootState) => state.uploadPageSliceReducer.uploadingBlobs
export const getUploadReducerCheckDuplicatesInCurrentDir = (state: RootState) => (
  state.uploadPageSliceReducer.checkForDuplicatesOnlyInCurrentFolder
)
export const getUploadReducerFilesArr = (state: RootState) => state.uploadPageSliceReducer.filesArr
export const getUploadReducerOpenMenus = (state: RootState) => state.uploadPageSliceReducer.openMenus
export const getUploadReducerSelectedList = (state: RootState) => state.uploadPageSliceReducer.selectedList
export const getUploadReducerSort = (state: RootState) => state.uploadPageSliceReducer.sort
export const getUploadReducerUploadStatus = (state: RootState) => state.uploadPageSliceReducer.uploadingStatus
export const getUploadReducerShowUppyUploaderModal = (state: RootState) => state.uploadPageSliceReducer.showUppyUploaderModal

export const getUploadReducerHasFailedUploadingFiles = createSelector(getUploadReducerFilesArr, uploadingFilesArr => (
  uploadingFilesArr.some(({ staticPath }) => !staticPath)
))

export const getUploadReducerKeywords = createSelector(
  getUploadReducerFilesArr,
  (uploadingFilesArr): string[] => compose(
    getUniqArr,
    map((item: Media) => item?.keywords || []),
  )(uploadingFilesArr),
)
