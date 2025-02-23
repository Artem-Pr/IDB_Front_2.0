import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { Media } from 'src/api/models/media'
import { mainPageReducerSetFilesArr } from 'src/redux/reducers/mainPageSlice'
import { sessionReducerSetIsTimeDifferenceApplied } from 'src/redux/reducers/sessionSlice'
import { getSessionReducerIsCurrentPage, getSessionReducerIsTimesDifferenceApplied } from 'src/redux/reducers/sessionSlice/selectors'
import { uploadReducerSetFilesArr } from 'src/redux/reducers/uploadSlice'
import { getCurrentFilesArr } from 'src/redux/selectors'

type FormattedOriginalDate = string
export type OriginalDates = Record<Media['id'], FormattedOriginalDate | null>

export const useUpdateOriginalDate = () => {
  const dispatch = useDispatch()
  const isTimesDifferenceApplied = useSelector(getSessionReducerIsTimesDifferenceApplied)
  const { isMainPage, isUploadPage } = useSelector(getSessionReducerIsCurrentPage)
  const filesArr = useSelector(getCurrentFilesArr)
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

    isMainPage && dispatch(mainPageReducerSetFilesArr(updatedDatesList))
    isUploadPage && dispatch(uploadReducerSetFilesArr(updatedDatesList))
    // Don't set for upload page, because in upload page changes apply immediately
    isMainPage && dispatch(sessionReducerSetIsTimeDifferenceApplied(true))
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
