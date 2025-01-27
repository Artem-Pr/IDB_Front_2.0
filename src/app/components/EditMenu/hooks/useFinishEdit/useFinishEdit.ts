import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import {
  compose, curry, flatten, isEmpty, uniq,
} from 'ramda'

import type { Media, MediaChangeable } from 'src/api/models/media'
import type { InitialFormData } from 'src/app/components/EditMenu'
import { duplicateConfig, emptyCheckboxesConfig } from 'src/assets/config/moduleConfig'
import { setKeywordsList } from 'src/redux/reducers/foldersSlice/foldersSlice'
import { folderElement } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type { NameParts } from 'src/redux/types'

import { removeEmptyFields } from '../../../../common/utils'
import { getISOStringWithUTC } from '../../../../common/utils/date'
import { useEditFilesArr } from '../useEditFilesArr'

import { getNewFilePath } from './helpers'

interface Props {
  filesArr: Media[]
  sameKeywords: string[]
  selectedList: number[]
  ext: NameParts['ext']
  originalName: string
  modal: Omit<ModalStaticFunctions, 'warn'>
  isMainPage: boolean
  isUploadingPage: boolean
}

export const useFinishEdit = ({
  filesArr,
  sameKeywords,
  selectedList,
  ext,
  originalName,
  isMainPage,
  isUploadingPage,
  modal,
}: Props) => {
  const dispatch = useAppDispatch()
  const { keywordsList } = useSelector(folderElement)
  const { editUploadingFiles, editMainPageFiles } = useEditFilesArr({
    filesArr,
    isMainPage,
    selectedList,
    sameKeywords,
  })

  const onFinish = useCallback(
    ({
      rating,
      description,
      originalName: newName,
      originalDate: newOriginalDate,
      timeStamp,
      keywords,
      isName,
      filePath,
      isOriginalDate,
      isKeywords,
      isFilePath,
      isRating,
      isDescription,
      isTimeStamp,
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
          rating: isRating ? rating : undefined,
          description: isDescription ? description : undefined,
          originalName: isName && newName ? currentName || undefined : undefined,
          originalDate: isOriginalDate ? originalDateISOString || undefined : undefined,
          keywords: isKeywords ? keywords : undefined,
          filePath: isFilePath && filePath ? getFilePath(filePath) : undefined,
          timeStamp: isTimeStamp ? timeStamp || undefined : undefined,
        }

        const updatedKeywordsList = keywords ? uniq([...keywordsList, ...flatten(keywords)]) : keywordsList
        compose(dispatch, setKeywordsList)(updatedKeywordsList)

        const editedFields = removeEmptyFields(preparedValue)
        if (!isEmpty(editedFields)) {
          isUploadingPage && editUploadingFiles(editedFields)
          isMainPage && editMainPageFiles(editedFields)
        }
      }

      const needModalIsDuplicate = isName && isDuplicateName(currentName)
      const isEmptyCheckboxes = !(
        isName
        || isOriginalDate
        || isKeywords
        || isFilePath
        || isRating
        || isDescription
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
      isUploadingPage,
      keywordsList,
      modal,
      originalName,
    ],
  )

  return { onFinish }
}
