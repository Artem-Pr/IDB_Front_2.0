import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import {
  compose, curry, flatten, isEmpty, uniq,
} from 'ramda'

import type { Media, MediaChangeable } from 'src/api/models/media'
import { removeEmptyFields } from 'src/app/common/utils'
import { getISOStringWithUTC } from 'src/app/common/utils/date'
import type { InitialFormData } from 'src/app/components/EditMenu'
import { duplicateConfig, emptyCheckboxesConfig } from 'src/assets/config/moduleConfig'
import { setKeywordsList } from 'src/redux/reducers/foldersSlice/foldersSlice'
import { folderElement, getIsCurrentPage } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { NameParts } from 'src/redux/types'

import { useEditFilesArr } from '../useEditFilesArr'

import { getNewFilePath } from './helpers'

interface Props {
  ext: NameParts['ext']
  filesArr: Media[]
  modal: Omit<ModalStaticFunctions, 'warn'>
  originalName: string
  sameKeywords: string[]
  selectedList: number[]
}

export const useFinishEdit = ({
  ext,
  filesArr,
  modal,
  originalName,
  sameKeywords,
  selectedList,
}: Props) => {
  const dispatch = useAppDispatch()
  const { keywordsList } = useSelector(folderElement)
  const { isMainPage, isUploadPage } = useSelector(getIsCurrentPage)
  const { editUploadingFiles, editMainPageFiles } = useEditFilesArr({
    filesArr,
    sameKeywords,
    selectedList,
  })

  const onFinish = useCallback(
    ({
      description,
      filePath,
      isDescription,
      isFilePath,
      isKeywords,
      isName,
      isOriginalDate,
      isRating,
      isTimeStamp,
      keywords,
      originalDate: newOriginalDate,
      originalName: newName,
      rating,
      timeStamp,
    }: InitialFormData) => {
      const currentName = newName ? `${newName}${ext}` as Media['originalName'] : ''
      const originalDateISOString = newOriginalDate
        ? getISOStringWithUTC(newOriginalDate)
        : null
      const isDuplicateName = curry((newFilesArr: Media[], newCurrentName: Media['originalName'] | '') => {
        const fileArrNames = newFilesArr.map(item => item.originalName)
        return fileArrNames.includes(newCurrentName)
      })(filesArr)

      const updateValues = () => {
        const getFilePath = curry(getNewFilePath)(isName, currentName, originalName)
        const preparedValue: Partial<MediaChangeable> = {
          description: isDescription ? description : undefined,
          filePath: isFilePath && filePath ? getFilePath(filePath) : undefined,
          keywords: isKeywords ? keywords : undefined,
          originalDate: isOriginalDate ? originalDateISOString || undefined : undefined,
          originalName: isName && newName ? currentName || undefined : undefined,
          rating: isRating ? rating : undefined,
          timeStamp: isTimeStamp ? timeStamp || undefined : undefined,
        }

        const updatedKeywordsList = keywords ? uniq([...keywordsList, ...flatten(keywords)]) : keywordsList
        compose(dispatch, setKeywordsList)(updatedKeywordsList)

        const editedFields = removeEmptyFields(preparedValue)
        if (!isEmpty(editedFields)) {
          isUploadPage && editUploadingFiles(editedFields)
          isMainPage && editMainPageFiles(editedFields)
        }
      }

      const needModalIsDuplicate = isName && isDuplicateName(currentName)
      const isEmptyCheckboxes = !(
        isName
        || isDescription
        || isFilePath
        || isKeywords
        || isOriginalDate
        || isRating
        || isTimeStamp
      )

      needModalIsDuplicate && modal.warning(duplicateConfig)
      isEmptyCheckboxes && modal.warning(emptyCheckboxesConfig)

      !(needModalIsDuplicate || isEmptyCheckboxes) && updateValues()
    },
    [
      dispatch,
      editMainPageFiles,
      editUploadingFiles,
      ext,
      filesArr,
      isMainPage,
      isUploadPage,
      keywordsList,
      modal,
      originalName,
    ],
  )

  return { onFinish }
}
