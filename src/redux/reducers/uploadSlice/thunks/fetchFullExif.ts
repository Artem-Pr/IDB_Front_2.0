import {
  compose, curry, keys, reduce,
} from 'ramda'

import { mainApi } from '../../../../api/api'
import { errorMessage } from '../../../../app/common/notifications'
import { getUpdatedExifFieldsObj, updateFilesArrItemByField } from '../../../../app/common/utils'
import { upload } from '../../../selectors'
import type { AppThunk } from '../../../store/types'
import type { UploadingObject } from '../../../types'
import { updateFullExifFile, updateUploadingFilesArr } from '../uploadSlice'

export const fetchFullExif = (tempPathArr: string[]): AppThunk => async (dispatch, getState) => {
  await mainApi
    .getKeywordsFromPhoto(tempPathArr)
    .then(({ data }) => {
      dispatch(updateFullExifFile(data))
      const { uploadingFiles, fullExifFilesList } = upload(getState())
      const getUpdatingObj = curry(getUpdatedExifFieldsObj)(fullExifFilesList)

      const loadExifToUploadingFiles = (acc: UploadingObject[], tempPath: string): UploadingObject[] => {
        const loadUpdatingObjToFilesArr = curry(updateFilesArrItemByField)('tempPath')(acc)
        return loadUpdatingObjToFilesArr(getUpdatingObj(tempPath))
      }

      const getUploadingFiles = (tempPaths: string[]) => (
        reduce<string, UploadingObject[]>(loadExifToUploadingFiles, uploadingFiles, tempPaths)
      )
      const uploadingFilesArr = compose(getUploadingFiles, <any>keys)(data)
      dispatch(updateUploadingFilesArr(uploadingFilesArr))
    })
    .catch(error => {
      errorMessage(error, 'Error when getting Exif: ')
    })
}
