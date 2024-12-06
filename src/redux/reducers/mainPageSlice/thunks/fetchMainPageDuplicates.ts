import { mainApi } from 'src/api/api'
import type { Media } from 'src/api/models/media'
import type { DuplicateFile } from 'src/api/types/types'
import { errorMessage } from 'src/app/common/notifications'
import { downloadingFiles } from 'src/redux/selectors'
import type { AppThunk } from 'src/redux/store/types'

import { setDownloadingFiles } from '../mainPageSlice'

export const fetchMainPageDuplicates = (
  originalNameList: Media['originalName'][],
  callback?: (mediaListWithDuplicates: Media[]) => void,
): AppThunk => async (dispatch, getState) => {
  await mainApi
    .checkDuplicates(originalNameList)
    .then(({ data }) => {
      const downloadingFilesArr = downloadingFiles(getState())
      const updatedDownloadingFiles: Media[] = downloadingFilesArr.map(file => {
        const existedFilesArr: DuplicateFile[] | undefined = data[file.originalName]

        if (!existedFilesArr?.length) {
          return file
        }

        return { ...file, duplicates: existedFilesArr }
      })
      dispatch(setDownloadingFiles(updatedDownloadingFiles))

      callback && callback(updatedDownloadingFiles)
    })
    .catch(error => {
      console.error(error)
      errorMessage(error, 'Error when getting files duplicates: ')
    })
}
