import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerSetFilesArr } from '..'
import { customSortingComparator } from '../helpers'
import { getUploadReducerFilesArr, getUploadReducerSort } from '../selectors'

export const applySorting = (): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = getUploadReducerSort(getState())
  const filesArr = getUploadReducerFilesArr(getState())

  const sortedFiles = filesArr.toSorted(customSortingComparator(gallerySortingList))
  dispatch(uploadReducerSetFilesArr(sortedFiles))
}
