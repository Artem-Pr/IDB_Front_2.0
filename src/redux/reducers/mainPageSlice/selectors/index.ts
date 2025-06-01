import { compose, map } from 'ramda'
import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { getUniqArr } from 'src/app/common/utils'
import type { RootState } from 'src/redux/store/types'

export const getMainPageReducerFilesArr = (state: RootState) => state.mainPageSliceReducer.filesArr
export const getMainPageReducerIsGalleryLoading = (state: RootState) => state.mainPageSliceReducer.isGalleryLoading
export const getMainPageReducerFilesSizeSum = (state: RootState) => state.mainPageSliceReducer.filesSizeSum
export const getMainPageReducerGalleryPagination = (state: RootState) => state.mainPageSliceReducer.galleryPagination
export const getMainPageReducerImagePreview = (state: RootState) => state.mainPageSliceReducer.preview
export const getMainPageReducerIsDeleteProcessing = (state: RootState) => state.mainPageSliceReducer.isDeleteProcessing
export const getMainPageReducerOpenMenus = (state: RootState) => state.mainPageSliceReducer.openMenus
export const getMainPageReducerSearchMenu = (state: RootState) => state.mainPageSliceReducer.searchMenu
export const getMainPageReducerSelectedList = (state: RootState) => state.mainPageSliceReducer.selectedList
export const getMainPageReducerSort = (state: RootState) => state.mainPageSliceReducer.sort
export const getMainPageReducerSortGroupedByDate = (state: RootState) => state.mainPageSliceReducer.sort.groupedByDate

export const getMainPageReducerDuplicateFilesArr = createSelector(
  getMainPageReducerFilesArr,
  (filesArr): DuplicateFile[] => filesArr
    .reduce<DuplicateFile[]>((accum, { duplicates = [] }) => [...accum, ...duplicates], []),
)

export const getMainPageReducerPreviewDuplicates = createSelector(
  [getMainPageReducerDuplicateFilesArr, getMainPageReducerImagePreview],
  (duplicates, preview): DuplicateFile[] => (
    duplicates.filter(({ originalName }) => originalName === preview.originalName)),
)

export const getMainPageReducerKeywords = createSelector(
  getMainPageReducerFilesArr,
  (filesArr): string[] => compose(
    getUniqArr,
    map((item: Media) => item.keywords || []),
  )(filesArr),
)
