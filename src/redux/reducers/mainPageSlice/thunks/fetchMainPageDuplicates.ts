import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { errorMessage } from 'src/app/common/notifications'
import type { AppThunk } from 'src/redux/store/types'

import { mainPageReducerSetFilesArr } from '..'

export const fetchMainPageDuplicates = (
  mediaFiles: Media[],
  callback?: (mediaListWithDuplicates: Media[]) => void,
): AppThunk => async dispatch => {
  await mainApi
    .checkDuplicates(mediaFiles.map(({ originalName }) => originalName))
    .then(({ data }) => {
      const updatedDownloadingFiles: Media[] = mediaFiles.map(file => {
        const existedFilesArr = data[file.originalName] as DuplicateFile[] | undefined

        if (existedFilesArr && existedFilesArr?.length > 1) {
          const duplicates = existedFilesArr.filter(({ filePath }) => filePath !== file.filePath)
          return { ...file, duplicates }
        }

        return file
      })
      dispatch(mainPageReducerSetFilesArr(updatedDownloadingFiles))

      callback && callback(updatedDownloadingFiles)
    })
    .catch(error => {
      console.error(error)
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
