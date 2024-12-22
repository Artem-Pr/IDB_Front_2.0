import { uploadPageSort, uploadingFiles } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { customSortingComparator } from '../helpers'
import { updateUploadingFilesArr } from '../uploadSlice'

export const applySorting = (): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = uploadPageSort(getState())
  const filesArr = uploadingFiles(getState())

  const sortedFiles = filesArr.toSorted(customSortingComparator(gallerySortingList))
  dispatch(updateUploadingFilesArr(sortedFiles))
}
