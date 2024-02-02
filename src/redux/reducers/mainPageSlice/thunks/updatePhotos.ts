import { identity, sortBy } from 'ramda'

import { mainApi } from '../../../../api/api'
import { createFolderTree } from '../../../../app/common/folderTree'
import { errorMessage, successMessage } from '../../../../app/common/notifications'
import type { AppThunk } from '../../../store/types'
import type { UpdatedObject } from '../../../types'
import { setFolderTree, setPathsArr } from '../../foldersSlice/foldersSlice'
import { setIsTimeDifferenceApplied } from '../../sessionSlice/sessionSlice'
import { setDGalleryLoading } from '../mainPageSlice'

import { fetchPhotos } from './fetchPhotos'

export const updatePhotos = (updatedObjArr: UpdatedObject[]): AppThunk => dispatch => {
  const addNewPathsArr = (newPathsArr: string[]) => {
    dispatch(setPathsArr(sortBy(identity, newPathsArr)))
    dispatch(setFolderTree(createFolderTree(newPathsArr)))
  }

  dispatch(setDGalleryLoading(true))
  dispatch(setIsTimeDifferenceApplied(false))
  mainApi
    .updatePhotos(updatedObjArr)
    .then(response => {
      const { error, files, newFilePath } = response.data
      error && errorMessage(new Error(error), 'updating files error: ', 0)
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
