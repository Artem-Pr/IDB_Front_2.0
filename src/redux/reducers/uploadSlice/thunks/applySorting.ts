import { uploadPageSort, uploadingFiles } from '../../../selectors'
import { AppThunk } from '../../../store/store'
import { customSortingComparator } from '../helpers'
import { updateUploadingFilesArr } from '../uploadSlice'

export const applySorting = (): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = uploadPageSort(getState())
  const filesArr = uploadingFiles(getState())

  const sortedFiles = [...filesArr].sort(customSortingComparator(gallerySortingList))
  dispatch(updateUploadingFilesArr(sortedFiles))
}
