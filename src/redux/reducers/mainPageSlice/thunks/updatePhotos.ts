import { AxiosError, HttpStatusCode } from 'axios'

import { mainApi } from 'src/api/api'
import type { UpdatedFileAPIRequest } from 'src/api/types/request-types'
import type { CheckOriginalNameDuplicatesAPIResponse } from 'src/api/types/response-types'
import type { ErrorResponse } from 'src/api/types/types'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage, successMessage, warningMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { mainPageReducerSetIsGalleryLoading } from '..'
import { setFolderTree, setPathsArr } from '../../foldersSlice'
import { getFolderReducerUpdatedPathsArrFromMediaList } from '../../foldersSlice/selectors'
import { sessionReducerSetIsTimeDifferenceApplied } from '../../sessionSlice'

import { fetchPhotos } from './fetchPhotos'

const DUPLICATE_FILE_ERROR_MESSAGE = 'File name already exists:'
const UPLOADING_ERROR_MESSAGE = 'updating files error'

export const updatePhotos = (updatedObjArr: UpdatedFileAPIRequest[]): AppThunk => (dispatch, getState) => {
  dispatch(mainPageReducerSetIsGalleryLoading(true))
  dispatch(sessionReducerSetIsTimeDifferenceApplied(false))
  mainApi
    .updatePhotos(updatedObjArr)
    .then(({ data }) => {
      const updatedPathsArr = getFolderReducerUpdatedPathsArrFromMediaList(getState(), data.response)
      const updatedFolderTree = createFolderTree(updatedPathsArr)
      dispatch(setPathsArr(updatedPathsArr))
      dispatch(setFolderTree(updatedFolderTree))

      successMessage('Files updated successfully')

      if (data.errors.length) {
        warningMessage(new Error(data.errors.join(', ')), UPLOADING_ERROR_MESSAGE, 100)
      }
    })
    .then(() => dispatch(fetchPhotos()))
    .catch((error: AxiosError<ErrorResponse<CheckOriginalNameDuplicatesAPIResponse>>) => {
      console.error('error', error)

      if (error.response?.status === HttpStatusCode.Conflict) {
        const duplicateFilesErrorMessage = `${DUPLICATE_FILE_ERROR_MESSAGE} ${Object
          .keys(error.response.data.cause)
          .join(', ')}`
        errorMessage(new Error(duplicateFilesErrorMessage), UPLOADING_ERROR_MESSAGE, 100)
      } else {
        errorMessage(new Error(error.response?.data.message), UPLOADING_ERROR_MESSAGE, 100)
      }
    })
    .finally(() => dispatch(mainPageReducerSetIsGalleryLoading(false)))
}
