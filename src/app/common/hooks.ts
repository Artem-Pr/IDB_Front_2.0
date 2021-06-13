import { useEffect, useMemo, useRef } from 'react'
import { compose, curry } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { upload } from '../../redux/selectors'
import { editFilesArr, getNameParts, getTempPath, isExifExist, renameShortNames } from './utils'
import { addToSelectedList, fetchFullExif, updateUploadingFilesArr } from '../../redux/reducers/uploadSlice-reducer'
import { UploadingObject } from '../../redux/types'

export const usePrevious = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    ref.current = value
  })
  return ref.current || value
}

export const useUpdateFields = () => {
  const dispatch = useDispatch()
  const { uploadingFiles, fullExifFilesList } = useSelector(upload)
  const getTempPathByIndex = useMemo(() => curry(getTempPath)(uploadingFiles), [uploadingFiles])

  const isExifExistByIndex = useMemo(() => {
    const getIsExifExist = curry(isExifExist)(fullExifFilesList)
    return compose(getIsExifExist, getTempPathByIndex)
  }, [fullExifFilesList, getTempPathByIndex])

  const updateUploadingFiles = (index: number) => {
    const isExifExist = isExifExistByIndex(index)
    !isExifExist && compose(dispatch, fetchFullExif, getTempPathByIndex)(index)
    dispatch(addToSelectedList(index))
  }

  return {
    updateUploadingFiles,
  }
}

export const useEditFilesArr = (selectedList: number[], uploadingFiles: UploadingObject[]) => {
  const dispatch = useDispatch()
  return useMemo(() => {
    const getRenamedObjects = (filesArr: UploadingObject[]): UploadingObject[] => {
      const fileNameParts = filesArr.map(({ name }) => getNameParts(name))
      const renamedNameParts = renameShortNames(fileNameParts)
      return filesArr.map((item, i) => {
        const { shortName, ext } = renamedNameParts[i]
        return { ...item, name: shortName + ext }
      })
    }

    const editFilesArrByEditedFields = curry(editFilesArr)(selectedList, uploadingFiles)

    return compose(dispatch, updateUploadingFilesArr, getRenamedObjects, editFilesArrByEditedFields)
  }, [dispatch, selectedList, uploadingFiles])
}
