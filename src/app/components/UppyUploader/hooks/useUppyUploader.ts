import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { UppyInstance } from 'src/api/uppy/uppyInstance'
import type { UppyInstanceConstructor, UppyType } from 'src/api/uppy/uppyTypes'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import { useAuth } from 'src/app/contexts/AuthContext'
import { getSessionReducerCurrentPage, getSessionReducerIsCurrentPage } from 'src/redux/reducers/sessionSlice/selectors'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'
import { uploadReducerClearSelectedList, uploadReducerSetShowUppyUploaderModal, uploadReducerSetUploadingStatus } from 'src/redux/reducers/uploadSlice'
import { getUploadReducerFilesArr } from 'src/redux/reducers/uploadSlice/selectors'
import { addUploadingFile } from 'src/redux/reducers/uploadSlice/thunks'
import { uppyUpload } from 'src/redux/reducers/uploadSlice/thunks/uppyUpload'
import { useAppDispatch } from 'src/redux/store/store'
import type { Defined } from 'src/redux/types'

import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import '@uppy/drop-target/dist/style.css'
import '@uppy/file-input/dist/style.css'

const onUploadError: Defined<UppyInstanceConstructor['onUploadError']> = (_file, error) => {
  errorMessage(error, 'Failed to upload files')
}

const onComplete: Defined<UppyInstanceConstructor['onComplete']> = ({ failed, successful }) => {
  if (failed?.length) {
    errorMessage(new Error(`Failed uploads: ${failed.length}`), 'Failed uploads')
  }
  if (successful?.length) {
    successMessage(`Successfully uploaded: ${successful.length}`)
  }
}

export const useUppyUploader = () => {
  const dispatch = useAppDispatch()
  const filesArr = useSelector(getUploadReducerFilesArr)
  const isNewUploader = useSelector(getSettingsReducerIsNewUploader)
  const { isLoginPage } = useSelector(getSessionReducerIsCurrentPage)
  const [uppy, setUppy] = useState<UppyType | null>(null)
  const { accessToken, isAuthenticated } = useAuth()

  const isFileAlreadyExist = useCallback<UppyInstanceConstructor['isFileAlreadyExist']>(currentFile => filesArr.some(file => file.originalName === currentFile.name), [filesArr])
  const processResponse = useCallback<UppyInstanceConstructor['processResponse']>(media => {
    dispatch(addUploadingFile(media))
  }, [dispatch])
  const onUploadStart = useCallback<Defined<UppyInstanceConstructor['onUploadStart']>>(() => {
    dispatch(uppyUpload(uppy))
  }, [dispatch, uppy])
  const onUploadSuccess = useCallback<Defined<UppyInstanceConstructor['onUploadSuccess']>>(() => {
    dispatch(uploadReducerClearSelectedList())
  }, [dispatch])

  useEffect(() => {
    if (uppy || !accessToken) {
      return
    }

    const uppyInstance = new UppyInstance({
      accessToken,
      isFileAlreadyExist,
      isGlobalDropZone: isNewUploader,
      onComplete,
      onUploadError,
      onUploadStart,
      onUploadSuccess,
      processResponse,
    })

    uppyInstance.setAccessToken(accessToken)

    setUppy(uppyInstance.uppy)
  }, [
    accessToken,
    dispatch,
    isFileAlreadyExist,
    isNewUploader,
    onUploadStart,
    onUploadSuccess,
    processResponse,
    uppy,
  ])

  return uppy
}
