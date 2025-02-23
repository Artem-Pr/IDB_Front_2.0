import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { compose, curry } from 'ramda'

import type { Media, NullableMedia } from 'src/api/models/media'
import { MediaInstance } from 'src/api/models/media'
import { errorMessage } from 'src/app/common/notifications'
import {
  copyByJSON, getFilePathWithoutName, removeIntersectingKeywords, updateFilesArrayItems,
} from 'src/app/common/utils'
import { getISOStringWithUTC } from 'src/app/common/utils/date'
import { applyOldNamesIfDuplicates, renameOriginalNameIfNeeded } from 'src/app/common/utils/duplicatesHelper'
import { getFileAPIRequestFromMediaList } from 'src/app/common/utils/getFileAPIRequestFromMedia'
import { updatePhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { getSessionReducerIsTimesDifferenceApplied } from 'src/redux/reducers/sessionSlice/selectors'
import { uploadReducerUpdateBlobName, uploadReducerSetFilesArr } from 'src/redux/reducers/uploadSlice'
import { fetchUploadDuplicates } from 'src/redux/reducers/uploadSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'

import { addEditedFieldsToFileArr, isEditNameOperation, prepareBlobUpdateNamePayload } from './helpers'

interface UseEditFilesArrProps {
  filesArr: Media[]
  selectedList: number[]
  sameKeywords: string[]
}

export const useEditFilesArr = ({
  filesArr,
  selectedList,
  sameKeywords = [],
}: UseEditFilesArrProps) => {
  const dispatch = useAppDispatch()
  const isTimesDifferenceApplied = useSelector(getSessionReducerIsTimesDifferenceApplied)

  const editMainPageFiles = useMemo(() => {
    let updatedFieldNames: (keyof Media)[] = []
    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))

    const addEditedFieldsToFilteredFileArr = (editedFields: Partial<Media>): Media[] => {
      const selectedFilesWithoutSameKeywords = editedFields.keywords
        ? removeIntersectingKeywords(sameKeywords, selectedFilesArr)
        : selectedFilesArr

      return addEditedFieldsToFileArr(selectedFilesWithoutSameKeywords, editedFields)
    }

    const timeDifferenceApplyMiddleware = (updatedFilesArr: Media[]): Media[] => {
      if (isTimesDifferenceApplied) {
        return updatedFilesArr.map((item, idx) => (
          { ...item, originalDate: getISOStringWithUTC(selectedFilesArr[idx].originalDate) }
        ))
      }
      return updatedFilesArr
    }

    const applyNewNamesToFilePaths = (mediaList: NullableMedia[]): NullableMedia[] => mediaList.map(media => {
      const newMedia = copyByJSON(media)
      if (newMedia.originalName && !newMedia.filePath) {
        const originalFilePath = selectedFilesArr.find(item => item.id === newMedia.id)?.filePath
        if (originalFilePath) {
          newMedia.filePath = `/${getFilePathWithoutName(originalFilePath)}/${newMedia.originalName}`
        }
      }
      return newMedia
    })

    const saveEditedFieldsMiddleware = (editedFields:Partial<Media>): Partial<Media> => {
      updatedFieldNames = Object.keys(editedFields)
        .filter(Boolean)
      return editedFields
    }

    const getMediaListWithOnlyEditedFields = (updatedFilesArr: Media[]): NullableMedia[] => (
      updatedFilesArr.map(mediaItem => {
        const newMediaItem = new MediaInstance(mediaItem).emptyInstance
        Object.keys(newMediaItem)
          .forEach(key => {
            if (updatedFieldNames.includes(key)) {
              (newMediaItem as any)[key] = mediaItem[key]
            }
            return newMediaItem
          })

        return newMediaItem
      }))

    return compose(
      dispatch,
      updatePhotos,
      getFileAPIRequestFromMediaList,
      applyNewNamesToFilePaths,
      getMediaListWithOnlyEditedFields,
      timeDifferenceApplyMiddleware,
      renameOriginalNameIfNeeded,
      addEditedFieldsToFilteredFileArr,
      saveEditedFieldsMiddleware,
    )
  }, [dispatch, filesArr, isTimesDifferenceApplied, sameKeywords, selectedList])

  const editUploadingFiles = useMemo(() => {
    const selectedFilesArr = filesArr.filter((_, idx) => selectedList.includes(idx))
    const addEditedFieldsToFilteredFileArr = (editedFields: Partial<Media>): Media[] => {
      const selectedFilesWithoutSameKeywords = editedFields.keywords
        ? removeIntersectingKeywords(sameKeywords, selectedFilesArr)
        : selectedFilesArr

      return addEditedFieldsToFileArr(selectedFilesWithoutSameKeywords, editedFields)
    }
    const mixUpdatedFilesItemsWithOriginalOnes = curry(updateFilesArrayItems)('id', filesArr)
    const updateFileBlobsNamesMiddleware = (newFilesArr: Media[]) => {
      filesArr
        .map(prepareBlobUpdateNamePayload(newFilesArr))
        .filter(isEditNameOperation)
        .forEach(compose(dispatch, uploadReducerUpdateBlobName))
      return newFilesArr
    }
    const checkNameDuplicatesMiddleware = (newFilesArr: Media[]) => {
      const { filesArrWithoutDuplicates, duplicatesNames } = applyOldNamesIfDuplicates(newFilesArr, filesArr)

      if (duplicatesNames.length) {
        const error = new Error(
          `The following files have duplicates and can't be updated:
            ${duplicatesNames}`,
        )
        errorMessage(error, 'Uploading files error')
      }

      dispatch(fetchUploadDuplicates(filesArrWithoutDuplicates.map(({ originalName }) => originalName)))
      return filesArrWithoutDuplicates
    }

    return compose(
      dispatch,
      uploadReducerSetFilesArr,
      mixUpdatedFilesItemsWithOriginalOnes,
      updateFileBlobsNamesMiddleware,
      checkNameDuplicatesMiddleware,
      renameOriginalNameIfNeeded,
      addEditedFieldsToFilteredFileArr,
    )
  }, [filesArr, sameKeywords, dispatch, selectedList])

  return { editUploadingFiles, editMainPageFiles }
}
