import type { UploadingObject } from '../../../types'
import type { AppThunk } from '../../../store/store'
import { updateUploadingFilesArr } from '../uploadSlice'
import { upload, uploadPageSort } from '../../../selectors'
import { customSortingComparator } from '../helpers'

export const addUploadingFile =
  (uploadingFile: UploadingObject): AppThunk =>
  (dispatch, getState) => {
    const { gallerySortingList } = uploadPageSort(getState())
    const { uploadingFiles } = upload(getState())

    const sortedFiles = [...uploadingFiles, uploadingFile].sort(customSortingComparator(gallerySortingList))
    dispatch(updateUploadingFilesArr(sortedFiles))
  }
