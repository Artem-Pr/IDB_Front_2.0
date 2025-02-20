import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { Media } from 'src/api/models/media'
import { setDownloadingFiles } from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { setIsTimeDifferenceApplied } from 'src/redux/reducers/sessionSlice/sessionSlice'
import { updateUploadingFilesArr } from 'src/redux/reducers/uploadSlice'
import { currentFilesList, getIsCurrentPage, sessionIsTimesDifferenceApplied } from 'src/redux/selectors'

type FormattedOriginalDate = string
export type OriginalDates = Record<Media['id'], FormattedOriginalDate | null>

export const useUpdateOriginalDate = () => {
  const dispatch = useDispatch()
  const isTimesDifferenceApplied = useSelector(sessionIsTimesDifferenceApplied)
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)
  const filesArr = useSelector(currentFilesList)
  const [originalDatesObj, setOriginalDatesObj] = useState<OriginalDates>({})

  const updateOriginalDates = useCallback(() => {
    const updatedDatesList = filesArr.map(file => {
      const getUpdatedFile = (id: Media['id']): Media => {
        const isOriginalDateUpdated = Boolean(originalDatesObj[id])

        return isOriginalDateUpdated
          ? {
            ...file,
            originalDate: originalDatesObj[id] || '-',
          }
          : file
      }

      return file.id ? getUpdatedFile(file.id) : file
    })

    isMainPage && dispatch(setDownloadingFiles(updatedDatesList))
    isUploadPage && dispatch(updateUploadingFilesArr(updatedDatesList))
    // Don't set for upload page, because in upload page changes apply immediately
    isMainPage && dispatch(setIsTimeDifferenceApplied(true))
  }, [dispatch, filesArr, isMainPage, isUploadPage, originalDatesObj])

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
