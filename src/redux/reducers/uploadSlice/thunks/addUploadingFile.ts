import type { Media } from 'src/api/models/media'
import { upload, uploadPageSort } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { customSortingComparator } from '../helpers'
import { updateUploadingFilesArr } from '../uploadSlice'

export const addUploadingFile = (uploadingFile: Media): AppThunk => (dispatch, getState) => {
  const { gallerySortingList } = uploadPageSort(getState())
  const { uploadingFiles } = upload(getState())

  const sortedFiles = [...uploadingFiles, uploadingFile].sort(customSortingComparator(gallerySortingList))
  dispatch(updateUploadingFilesArr(sortedFiles))
}
