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

  const isExifExist = (tempPath: string): boolean => !!fullExifFilesList[tempPath]

  const updateOne = (tempPath: string): Promise<boolean> | false => {
    return !isExifExist(tempPath) && dispatch(fetchFullExif([tempPath]))
  }

  const updateAll = (): Promise<boolean> | false => {
    const tempPathArr = uploadingFiles.map(({ tempPath }) => tempPath).filter(tempPath => !isExifExist(tempPath))
    return !!tempPathArr.length && dispatch(fetchFullExif(tempPathArr))
  }

  const load = (response: Promise<boolean>): Promise<boolean> => {
    dispatch(setLoading(true))
    return response.then(() => dispatch(setLoading(false)))
  }

  const updateUploadingFiles = (tempPath: string, all = false): Promise<boolean> => {
    const response = all ? updateAll() : updateOne(tempPath)
    return response ? load(response) : Promise.resolve(true)
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
