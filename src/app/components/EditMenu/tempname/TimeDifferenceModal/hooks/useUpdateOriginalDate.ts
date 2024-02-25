import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setDownloadingFiles } from '../../../../../../redux/reducers/mainPageSlice/mainPageSlice'
import { setIsTimeDifferenceApplied } from '../../../../../../redux/reducers/sessionSlice/sessionSlice'
import { updateUploadingFilesArr } from '../../../../../../redux/reducers/uploadSlice'
import { session } from '../../../../../../redux/selectors'
import { DownloadingObject } from '../../../../../../redux/types'
import { useCurrentPage, useFilesList } from '../../../../../common/hooks/hooks'

type FilePath = string
type FormattedOriginalDate = string
export type OriginalDates = Record<FilePath, FormattedOriginalDate | null>

export const useUpdateOriginalDate = () => {
  const dispatch = useDispatch()
  const { isTimesDifferenceApplied } = useSelector(session)
  const [originalDatesObj, setOriginalDatesObj] = useState<OriginalDates>({})

  const { isMainPage, isUploadingPage } = useCurrentPage()
  const { filesArr } = useFilesList()

  const updateOriginalDates = useCallback(() => {
    const updatedDatesList = filesArr.map(file => {
      const getUpdatedFile = (tempPath: string) => {
        const isOriginalDateUpdated = Boolean(originalDatesObj[tempPath])

        return isOriginalDateUpdated
          ? {
            ...file,
            originalDate: originalDatesObj[tempPath] as string,
          }
          : file
      }

      return file.tempPath ? getUpdatedFile(file.tempPath) : file
    })

    isMainPage && dispatch(setDownloadingFiles(updatedDatesList as DownloadingObject[]))
    isUploadingPage && dispatch(updateUploadingFilesArr(updatedDatesList))
    // Don't set for upload page, because in upload page changes apply immediately
    isMainPage && dispatch(setIsTimeDifferenceApplied(true))
  }, [dispatch, filesArr, isMainPage, isUploadingPage, originalDatesObj])

  const isOriginalDatesUpdated = Boolean(
    Object.keys(originalDatesObj)
      .filter(filePath => Boolean(originalDatesObj[filePath])).length,
  )

  return {
    isOriginalDatesUpdated,
    setOriginalDatesObj,
    updateOriginalDates,
    isTimesDifferenceApplied,
  }
}
