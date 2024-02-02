import { upload, uploadPageSort } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import type { UploadingObject } from '../../../types'
import { customSortingComparator } from '../helpers'
import { updateUploadingFilesArr } from '../uploadSlice'

export const addUploadingFile = (uploadingFile: UploadingObject): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = uploadPageSort(getState())
  const { uploadingFiles } = upload(getState())

  const sortedFiles = [...uploadingFiles, uploadingFile].sort(customSortingComparator(gallerySortingList))
  dispatch(updateUploadingFilesArr(sortedFiles))
}
