import { createSelector } from 'reselect'
import { addIndex, compose, filter, includes, intersection, map, reduce, union } from 'ramda'

import { RootState } from '../store/rootReducer'
import { UploadingObject } from '../types'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus
export const uploadingFiles = (state: RootState) => state.uploadReducer.uploadingFiles
export const selectedList = (state: RootState) => state.uploadReducer.selectedList

export const pathsArrOptionsSelector = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))

export const uploadPageGalleryPropsSelector = createSelector(
  upload,
  ({ uploadingFiles, selectedList, openMenus, fullExifFilesList }) => ({
    openMenus,
    selectedList,
    fullExifFilesList,
    imageArr: uploadingFiles,
  })
)

export const allUploadKeywords = createSelector(uploadingFiles, uploadingFiles => {
  const getUniqArr = (keywordsArrays: string[][]) => reduce<string[], string[]>(union, [], keywordsArrays)
  return compose(
    getUniqArr,
    map((item: UploadingObject) => item.keywords || [])
  )(uploadingFiles)
})

export const allSameKeywords = createSelector(uploadingFiles, selectedList, (uploadingFiles, selectedList) => {
  const filterIndexed = addIndex(filter)
  const getIntersectionArr = (keywordsArrays: string[][]) => {
    return keywordsArrays.length
      ? keywordsArrays.reduce((previousValue, currentValue): string[] => intersection(previousValue, currentValue))
      : []
  }

  return compose<UploadingObject[], UploadingObject[], string[][], string[]>(
    getIntersectionArr,
    map((item: UploadingObject) => item.keywords || []),
    filterIndexed((bom, index) => includes(index, selectedList))
  )(uploadingFiles)
})
