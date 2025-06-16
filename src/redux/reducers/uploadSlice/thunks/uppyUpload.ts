import { UppyType } from 'src/api/uppy/uppyTypes'
import type { AppThunk } from 'src/redux/store/types'

import { uploadReducerSetShowUppyUploaderModal, uploadReducerSetUploadingStatus } from '..'
import { getSessionReducerIsCurrentPage } from '../../sessionSlice/selectors'

export const uppyUpload = (uppyInstance: UppyType | null): AppThunk => (dispatch, getState) => {
  const { isLoginPage } = getSessionReducerIsCurrentPage(getState())
  if (isLoginPage) {
    uppyInstance?.clear()
    throw new Error('Cannot upload files without authentication')
  }

  dispatch(uploadReducerSetShowUppyUploaderModal(true))
  dispatch(uploadReducerSetUploadingStatus('empty'))
}
