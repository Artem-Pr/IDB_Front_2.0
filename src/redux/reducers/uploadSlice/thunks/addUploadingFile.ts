import type { Media } from 'src/api/models/media'
import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerSetFilesArr } from '..'
import { customSortingComparator } from '../helpers'
import { getUploadReducerSort, getUploadReducerFilesArr } from '../selectors'

export const addUploadingFile = (uploadingFile: Media): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = getUploadReducerSort(getState())
  const uploadingFiles = getUploadReducerFilesArr(getState())

  const sortedFiles = [...uploadingFiles, uploadingFile].sort(customSortingComparator(gallerySortingList))
  dispatch(uploadReducerSetFilesArr(sortedFiles))
}
