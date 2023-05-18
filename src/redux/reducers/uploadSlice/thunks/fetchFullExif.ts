/* eslint functional/immutable-data: 0 */
import { compose, curry, keys, reduce } from 'ramda'

import type { AppThunk } from '../../../store/store'
import { mainApi } from '../../../../api/api'
import type { UploadingObject } from '../../../types'
import { getUpdatedExifFieldsObj, updateFilesArrItemByField } from '../../../../app/common/utils'
import { errorMessage } from '../../../../app/common/notifications'
import { updateFullExifFile, updateUploadingFilesArr } from '../uploadSlice'

export const fetchFullExif =
  (tempPathArr: string[]): AppThunk =>
  async (dispatch, getState) => {
    await mainApi
      .getKeywordsFromPhoto(tempPathArr)
      .then(({ data }) => {
        dispatch(updateFullExifFile(data))
        const { uploadingFiles, fullExifFilesList } = getState().uploadReducer
        const getUpdatingObj = curry(getUpdatedExifFieldsObj)(fullExifFilesList)

        const loadExifToUploadingFiles = (acc: UploadingObject[], tempPath: string): UploadingObject[] => {
          const loadUpdatingObjToFilesArr = curry(updateFilesArrItemByField)('tempPath')(acc)
          return compose(loadUpdatingObjToFilesArr, getUpdatingObj)(tempPath)
        }

        const getUploadingFiles = (tempPathArr: string[]) => {
          return reduce<string, UploadingObject[]>(loadExifToUploadingFiles, uploadingFiles, tempPathArr)
        }
        const uploadingFilesArr = compose(getUploadingFiles, keys)(data)
        dispatch(updateUploadingFilesArr(uploadingFilesArr))
      })
      .catch(error => {
        errorMessage(error, 'Error when getting Exif: ')
      })
  }
