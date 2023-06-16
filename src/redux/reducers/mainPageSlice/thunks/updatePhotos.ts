import { identity, sortBy } from 'ramda'

import { UpdatedObject } from '../../../types'
import { AppThunk } from '../../../store/store'
import { setFolderTree, setPathsArr } from '../../foldersSlice-reducer'
import { createFolderTree } from '../../../../app/common/folderTree'
import { mainApi } from '../../../../api/api'
import { errorMessage, successMessage } from '../../../../app/common/notifications'
import { setDGalleryLoading } from '../mainPageSlice'
import { fetchPhotos } from './fetchPhotos'

export const updatePhotos =
  (updatedObjArr: UpdatedObject[]): AppThunk =>
  dispatch => {
    const addNewPathsArr = (newPathsArr: string[]) => {
      dispatch(setPathsArr(sortBy(identity, newPathsArr)))
      dispatch(setFolderTree(createFolderTree(newPathsArr)))
    }

    dispatch(setDGalleryLoading(true))
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
        console.log('error', error)
        errorMessage(error.message, 'updating files error: ', 0)
      })
      .finally(() => dispatch(setDGalleryLoading(false)))
  }
