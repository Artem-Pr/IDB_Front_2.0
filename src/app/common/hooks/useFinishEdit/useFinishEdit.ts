import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import {
  compose, curry, flatten, identity, isEmpty, sortBy, uniq,
} from 'ramda'

import { duplicateConfig, emptyCheckboxesConfig, longProcessConfirmation } from '../../../../assets/config/moduleConfig'
import { setKeywordsList } from '../../../../redux/reducers/foldersSlice/foldersSlice'
import { updatePhotos } from '../../../../redux/reducers/mainPageSlice/thunks'
import { folderElement, session } from '../../../../redux/selectors'
import { useAppDispatch } from '../../../../redux/store/store'
import type {
  Checkboxes, FieldsObj, UpdatedObject, UploadingObject,
} from '../../../../redux/types'
import type { InitialFileObject } from '../../../components/EditMenu'
import {
  getFilesWithUpdatedKeywords,
  getRenamedObjects,
  removeEmptyFields,
  removeIntersectingKeywords,
} from '../../utils'
import { formatDate } from '../../utils/date'
import { useEditFilesArr } from '../hooks'

import { getNewFilePath, getFilesSizeIfLongProcess } from './helpers'

interface Props {
  filesArr: FieldsObj[]
  sameKeywords: string[]
  selectedList: number[]
  ext: string
  name: string
  modal: Omit<ModalStaticFunctions, 'warn'>
  isMainPage: boolean
  isEditMany?: boolean
}

interface SendUpdatedFilesProps {
  currentName: string
  currentOriginalDate: string | null
  currentFilePath: string
  keywords: string[]
  rating: number
  description: string
  checkboxes: Checkboxes
  timeStamp: string | undefined
}

export const useFinishEdit = ({
  filesArr,
  sameKeywords,
  selectedList,
  ext,
  name,
  isMainPage,
  isEditMany,
  modal,
}: Props) => {
  const dispatch = useAppDispatch()
  const { keywordsList } = useSelector(folderElement)
  const { isTimesDifferenceApplied } = useSelector(session)
  const editUploadingFiles = useEditFilesArr({
    filesArr,
    isMainPage,
    selectedList,
    sameKeywords,
  })

  const sendUpdatedFiles = useCallback(
    ({
      rating,
      currentName,
      currentOriginalDate,
      currentFilePath,
      keywords: newKeywords,
      description,
      checkboxes,
      timeStamp,
    }: SendUpdatedFilesProps) => {
      const selectedFiles = filesArr
        .filter((_, idx) => selectedList.includes(idx))
        .map(({ _id, keywords, originalDate }) => ({
          _id,
          keywords,
          name: currentName,
          originalDate,
        }))
      const newNamesArr: string[] = getRenamedObjects(selectedFiles)
        .map(item => item.name)
      const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFiles)
      const newKeywordsArr: string[][] = getFilesWithUpdatedKeywords(selectedFilesWithoutSameKeywords, newKeywords)
        .map(
          ({ keywords }) => keywords || [],
        )
      const getNewOriginalDate = (idx: number) => (
        isTimesDifferenceApplied ? selectedFiles[idx].originalDate : currentOriginalDate
      )

      const getUpdatedFields = (idx: number): UpdatedObject['updatedFields'] => {
        const {
          isName,
          isOriginalDate,
          isKeywords,
          isFilePath,
          isRating,
          isDescription,
          isTimeStamp,
          needUpdatePreview,
        } = checkboxes
        return {
          originalName: isName && !newNamesArr[idx].startsWith('-') ? newNamesArr[idx] : undefined,
          originalDate: (isOriginalDate && getNewOriginalDate(idx)) || undefined,
          keywords: isKeywords ? newKeywordsArr[idx] : undefined,
          filePath: isFilePath ? currentFilePath : undefined,
          rating: isRating ? rating : undefined,
          description: isDescription ? description : undefined,
          timeStamp: isTimeStamp ? timeStamp : undefined,
          needUpdatePreview: needUpdatePreview || undefined,
        }
      }
      const updatedFiles: UpdatedObject[] = selectedFiles.map(({ _id }, i) => ({
        id: _id || '',
        updatedFields: getUpdatedFields(i),
      }))

      updatedFiles.length && dispatch(updatePhotos(updatedFiles))
    },
    [dispatch, filesArr, isTimesDifferenceApplied, sameKeywords, selectedList],
  )

  const onFinish = useCallback(
    ({
      rating,
      description,
      name: newName,
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
      needUpdatePreview,
    }: InitialFileObject) => {
      const currentName = newName ? newName + ext : ''
      const currentOriginalDate = newOriginalDate ? formatDate(newOriginalDate) : null
      const isDuplicateName = curry((newFilesArr: UploadingObject[], newCurrentName: string) => {
        const fileArrNames = newFilesArr.map(item => item.name)
        return fileArrNames.includes(newCurrentName)
      })(filesArr)

      const updateValues = () => {
        const getFilePath = curry(getNewFilePath)(isName, currentName, name)
        const preparedValue = {
          rating: (isRating && rating) || undefined,
          description: (isDescription && description) || undefined,
          name: isName && newName ? currentName : undefined,
          originalDate: isOriginalDate ? currentOriginalDate : undefined,
          keywords: isKeywords ? keywords : sortBy(identity, sameKeywords || []),
          filePath: isFilePath && filePath ? getFilePath(filePath) : undefined,
          timeStamp: isTimeStamp ? timeStamp : undefined,
          needUpdatePreview: needUpdatePreview || undefined,
        }

        const updatedKeywordsList = uniq([...keywordsList, ...flatten(keywords)])
        compose(dispatch, setKeywordsList)(updatedKeywordsList)

        const checkboxes: Checkboxes = {
          isName,
          isOriginalDate,
          isKeywords,
          isFilePath,
          isRating,
          isDescription,
          isTimeStamp,
          needUpdatePreview,
        }
        isMainPage
          && sendUpdatedFiles({
            currentName,
            currentOriginalDate,
            currentFilePath: `/${filePath}`,
            keywords,
            rating,
            description,
            checkboxes,
            timeStamp,
          })
        const editedFields = removeEmptyFields(preparedValue)
        !isEmpty(editedFields) && editUploadingFiles(editedFields)
      }

      const needModalIsDuplicate = !isEditMany && isName && isDuplicateName(currentName)
      const isEmptyCheckboxes = !(
        isName
        || isOriginalDate
        || isKeywords
        || isFilePath
        || isRating
        || isDescription
        || isTimeStamp
        || needUpdatePreview
      )
      const filesSizeIfLongProcess = isMainPage
      && !needModalIsDuplicate
       && !isEmptyCheckboxes
       && getFilesSizeIfLongProcess(filesArr, selectedList)

      needModalIsDuplicate && modal.warning(duplicateConfig)
      isEmptyCheckboxes && modal.warning(emptyCheckboxesConfig)
      filesSizeIfLongProcess
        && modal.confirm(longProcessConfirmation({ onOk: updateValues, fileSize: filesSizeIfLongProcess }))

      !(needModalIsDuplicate || isEmptyCheckboxes || filesSizeIfLongProcess) && updateValues()
    },
    [
      dispatch,
      editUploadingFiles,
      ext,
      sendUpdatedFiles,
      filesArr,
      isEditMany,
      isMainPage,
      keywordsList,
      modal,
      name,
      sameKeywords,
      selectedList,
    ],
  )

  return { onFinish }
}
