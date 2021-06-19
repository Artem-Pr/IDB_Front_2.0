import { useEffect, useMemo, useRef } from 'react'
import { compose, curry } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { upload } from '../../redux/selectors'
import { editFilesArr, getNameParts, renameShortNames } from './utils'
import { fetchFullExif, setLoading, updateUploadingFilesArr } from '../../redux/reducers/uploadSlice-reducer'
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
  const dispatch = useDispatch<any>()
  const { fullExifFilesList, uploadingFiles } = useSelector(upload)

  const updateOne = (tempPath: string): Promise<boolean> | boolean => {
    const isExifExist = !!fullExifFilesList[tempPath]
    return !isExifExist && dispatch(fetchFullExif(tempPath))
  }

  const updateAll = (): Array<Promise<boolean> | boolean> => {
    return uploadingFiles.map(({ tempPath }) => updateOne(tempPath))
  }

  const updateUploadingFiles = (tempPath: string, all = false) => {
    const response = all ? updateAll() : [updateOne(tempPath)]
    dispatch(setLoading(true))
    Promise.all(response).then(() => dispatch(setLoading(false)))
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
