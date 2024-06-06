import { identity, sortBy } from 'ramda'

import { mainApi } from 'src/api/api'
import type { UpdatedFileAPIRequest } from 'src/api/dto/request-types'
import { createFolderTree } from 'src/app/common/folderTree'
import { errorMessage, successMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { setFolderTree, setPathsArr } from '../../foldersSlice/foldersSlice'
import { setIsTimeDifferenceApplied } from '../../sessionSlice/sessionSlice'
import { setDGalleryLoading } from '../mainPageSlice'

import { fetchPhotos } from './fetchPhotos'

export const updatePhotos = (updatedObjArr: UpdatedFileAPIRequest[]): AppThunk => dispatch => {
  const addNewPathsArr = (newPathsArr: string[]) => {
    dispatch(setPathsArr(sortBy(identity, newPathsArr)))
    dispatch(setFolderTree(createFolderTree(newPathsArr)))
  }

  dispatch(setDGalleryLoading(true))
  dispatch(setIsTimeDifferenceApplied(false))
  mainApi
    .updatePhotos(updatedObjArr)
    .then(response => {
      const { files, newFilePath } = response.data
      files && newFilePath && successMessage('Files updated successfully')
      newFilePath?.length && addNewPathsArr(newFilePath)
    })
    .then(() => dispatch(fetchPhotos()))
    .catch(error => {
      console.error('error', error)
      errorMessage(error.message, 'updating files error: ', 0)
    })
    .finally(() => dispatch(setDGalleryLoading(false)))
}
