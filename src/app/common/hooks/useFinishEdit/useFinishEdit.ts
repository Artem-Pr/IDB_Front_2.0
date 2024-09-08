import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import {
  compose, curry, flatten, identity, isEmpty, sortBy, uniq,
} from 'ramda'

import type { UpdatedFileAPIRequest } from 'src/api/dto/request-types'
import type { Media, MediaChangeable } from 'src/api/models/media'
import type { InitialFileObject } from 'src/app/components/EditMenu'
import { duplicateConfig, emptyCheckboxesConfig, longProcessConfirmation } from 'src/assets/config/moduleConfig'
import { setKeywordsList } from 'src/redux/reducers/foldersSlice/foldersSlice'
import { updatePhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { folderElement, session } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import type {
  Checkboxes, NameParts,
} from 'src/redux/types'

import {
  getFilesWithUpdatedKeywords,
  getRenamedObjects,
  removeEmptyFields,
  removeIntersectingKeywords,
} from '../../utils'
import { getISOStringWithUTC } from '../../utils/date'
import { useEditFilesArr } from '../hooks'

import { getNewFilePath, getFilesSizeIfLongProcess } from './helpers'

interface Props {
  filesArr: Media[]
  sameKeywords: string[]
  selectedList: number[]
  ext: NameParts['ext']
  originalName: string
  modal: Omit<ModalStaticFunctions, 'warn'>
  isMainPage: boolean
  isEditMany?: boolean
}

interface SendUpdatedFilesProps {
  currentName: Media['originalName'] | '-'
  currentOriginalDate: string | null
  currentFilePath: Media['filePath']
  keywords: Media['keywords']
  rating: Media['rating']
  description: Media['description']
  checkboxes: Checkboxes
  timeStamp: string | undefined
}

export const useFinishEdit = ({
  filesArr,
  sameKeywords,
  selectedList,
  ext,
  originalName,
  isMainPage,
  isEditMany,
  modal,
}: Props) => {
  const dispatch = useAppDispatch()
  const { keywordsList } = useSelector(folderElement)
  const { isTimesDifferenceApplied } = useSelector(session)
  const { editUploadingFiles } = useEditFilesArr({
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
        .filter((_file, idx) => selectedList.includes(idx))
        .map(({ id, keywords, originalDate }) => ({
          id,
          keywords,
          originalName: currentName,
          originalDate,
        }))
      const newNamesArr = getRenamedObjects(selectedFiles)
        .map(item => item.originalName)
      const selectedFilesWithoutSameKeywords = removeIntersectingKeywords(sameKeywords, selectedFiles)
      const newKeywordsArr: string[][] = getFilesWithUpdatedKeywords(selectedFilesWithoutSameKeywords, newKeywords)
        .map(
          ({ keywords }) => keywords || [],
        )
      const getNewOriginalDate = (idx: number) => (
        isTimesDifferenceApplied ? selectedFiles[idx].originalDate : currentOriginalDate
      )

      const getUpdatedFields = (idx: number): UpdatedFileAPIRequest['updatedFields'] => {
        const {
          isName,
          isOriginalDate,
          isKeywords,
          isFilePath,
          isRating,
          isDescription,
          isTimeStamp,
        } = checkboxes
        return {
          originalName: isName && !newNamesArr[idx].startsWith('-') ? newNamesArr[idx] as Media['originalName'] : undefined,
          originalDate: (isOriginalDate && getNewOriginalDate(idx)) || undefined,
          keywords: isKeywords ? newKeywordsArr[idx] : undefined,
          filePath: isFilePath && currentFilePath ? currentFilePath : undefined,
          rating: isRating && rating ? rating : undefined,
          description: isDescription && description ? description : undefined,
          timeStamp: isTimeStamp ? timeStamp : undefined,
        }
      }
      const updatedFiles: UpdatedFileAPIRequest[] = selectedFiles.map(({ id }, idx) => ({
        id,
        updatedFields: getUpdatedFields(idx),
      }))

      updatedFiles.length && dispatch(updatePhotos(updatedFiles))
    },
    [dispatch, filesArr, isTimesDifferenceApplied, sameKeywords, selectedList],
  )

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
    }: InitialFileObject) => {
      const currentName = newName ? `${newName}${ext}` as Media['originalName'] : ''
      const currentOriginalDate = newOriginalDate
        ? getISOStringWithUTC(newOriginalDate)
        : null
      const isDuplicateName = curry((newFilesArr: Media[], newCurrentName: Media['originalName'] | '') => {
        const fileArrNames = newFilesArr.map(item => item.originalName)
        return fileArrNames.includes(newCurrentName)
      })(filesArr)

      const updateValues = () => {
        const getFilePath = curry(getNewFilePath)(isName, currentName, originalName)
        const preparedValue: Partial<MediaChangeable> = {
          rating: (isRating && rating) || undefined,
          description: (isDescription && description) || undefined,
          originalName: isName && newName ? currentName || undefined : undefined,
          originalDate: isOriginalDate ? currentOriginalDate || undefined : undefined,
          keywords: isKeywords ? keywords : sortBy(identity, sameKeywords || []),
          filePath: isFilePath && filePath ? getFilePath(filePath) : undefined,
          timeStamp: isTimeStamp ? timeStamp : undefined,
        }

        const updatedKeywordsList = keywords ? uniq([...keywordsList, ...flatten(keywords)]) : keywordsList
        compose(dispatch, setKeywordsList)(updatedKeywordsList)

        const checkboxes: Checkboxes = {
          isName,
          isOriginalDate,
          isKeywords,
          isFilePath,
          isRating,
          isDescription,
          isTimeStamp,
        }
        isMainPage
          && sendUpdatedFiles({
            currentName: currentName || '-',
            currentOriginalDate,
            currentFilePath: `/${filePath}` as Media['filePath'],
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
      originalName,
      sameKeywords,
      selectedList,
    ],
  )

  return { onFinish }
}
