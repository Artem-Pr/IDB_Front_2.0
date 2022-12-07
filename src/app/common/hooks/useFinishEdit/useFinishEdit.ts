import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose, curry, flatten, identity, isEmpty, sortBy, uniq } from 'ramda'

import { ModalStaticFunctions } from 'antd/es/modal/confirm'

import {
  getFilesWithUpdatedKeywords,
  getRenamedObjects,
  removeEmptyFields,
  removeIntersectingKeywords,
} from '../../utils'
import { Checkboxes, FieldsObj, UpdatedObject, UploadingObject } from '../../../../redux/types'
import { useEditFilesArr } from '../hooks'
import { duplicateConfig, emptyCheckboxesConfig, longProcessConfirmation } from '../../../../assets/config/moduleConfig'
import { formatDate } from '../../utils/date'
import { getNewFilePath, getFilesSizeIfLongProcess } from './helpers'
import { updatePhotos } from '../../../../redux/reducers/mainPageSlice/thunks'
import { setKeywordsList } from '../../../../redux/reducers/foldersSlice-reducer'
import { folderElement } from '../../../../redux/selectors'

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
  const dispatch = useDispatch()
  const { keywordsList } = useSelector(folderElement)
  const editUploadingFiles = useEditFilesArr(selectedList, filesArr, sameKeywords, isMainPage)

  const fetchUpdatedFiles = useCallback(
    (
      currentName: string,
      currentOriginalDate: string | null,
      currentFilePath: string,
      keywords: string[],
      checkboxes: Checkboxes
    ) => {
      const selectedFiles = filesArr
        .filter((_, idx) => selectedList.includes(idx))
        .map(({ _id, keywords }) => ({
          _id,
          keywords,
          name: currentName,
        }))
      const newNamesArr: string[] = getRenamedObjects(selectedFiles).map(({ name }) => name)
      const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFiles)
      const newKeywordsArr: string[][] = getFilesWithUpdatedKeywords(selectedFilesWithoutSameKeywords, keywords).map(
        ({ keywords }) => keywords || []
      )

      const getUpdatedFields = (idx: number) => {
        const { isName, isOriginalDate, isKeywords, isFilePath } = checkboxes
        return {
          originalName: isName && !newNamesArr[idx].startsWith('-') ? newNamesArr[idx] : undefined,
          originalDate: (isOriginalDate && currentOriginalDate) || undefined,
          keywords: isKeywords ? newKeywordsArr[idx] : undefined,
          filePath: isFilePath ? currentFilePath : undefined,
        }
      }
      const updatedFiles: UpdatedObject[] = selectedFiles.map(({ _id }, i) => ({
        id: _id || '',
        updatedFields: getUpdatedFields(i),
      }))

      updatedFiles.length && compose(dispatch, updatePhotos)(updatedFiles)
    },
    [dispatch, filesArr, sameKeywords, selectedList]
  )

  const onFinish = useCallback(
    ({
      name: newName,
      originalDate: newOriginalDate,
      keywords,
      isName,
      filePath,
      isOriginalDate,
      isKeywords,
      isFilePath,
    }: any) => {
      const currentName = newName ? newName + ext : ''
      const currentOriginalDate = newOriginalDate ? formatDate(newOriginalDate) : null
      const isDuplicateName = curry((filesArr: UploadingObject[], currentName: string) => {
        const fileArrNames = filesArr.map(({ name }) => name)
        return fileArrNames.includes(currentName)
      })(filesArr)

      const updateValues = () => {
        const getFilePath = curry(getNewFilePath)(isName, currentName, name)
        const preparedValue = {
          name: isName && newName ? currentName : undefined,
          originalDate: isOriginalDate ? currentOriginalDate : undefined,
          keywords: isKeywords ? keywords : sortBy(identity, sameKeywords || []),
          filePath: isFilePath && filePath ? getFilePath(filePath) : undefined,
        }

        const updatedKeywordsList = uniq([...keywordsList, ...flatten(keywords)])
        compose(dispatch, setKeywordsList)(updatedKeywordsList)

        const checkboxes: Checkboxes = { isName, isOriginalDate, isKeywords, isFilePath }
        isMainPage && fetchUpdatedFiles(currentName, currentOriginalDate, `/${filePath}`, keywords, checkboxes)
        const editedFields = removeEmptyFields(preparedValue)
        !isEmpty(editedFields) && editUploadingFiles(editedFields)
      }

      const needModalIsDuplicate = !isEditMany && isName && isDuplicateName(currentName)
      const isEmptyCheckboxes = !isName && !isOriginalDate && !isKeywords && !isFilePath
      const filesSizeIfLongProcess =
        !needModalIsDuplicate && !isEmptyCheckboxes && getFilesSizeIfLongProcess(filesArr, selectedList)

      needModalIsDuplicate && modal.warning(duplicateConfig)
      isEmptyCheckboxes && modal.warning(emptyCheckboxesConfig)
      filesSizeIfLongProcess &&
        modal.confirm(longProcessConfirmation({ onOk: updateValues, fileSize: filesSizeIfLongProcess }))
      !(needModalIsDuplicate || isEmptyCheckboxes || filesSizeIfLongProcess) && updateValues()
    },
    [
      dispatch,
      editUploadingFiles,
      ext,
      fetchUpdatedFiles,
      filesArr,
      isEditMany,
      isMainPage,
      keywordsList,
      modal,
      name,
      sameKeywords,
      selectedList,
    ]
  )

  return { onFinish }
}
