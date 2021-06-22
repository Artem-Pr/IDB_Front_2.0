import { createSelector } from 'reselect'
import { compose, keys, map, reduce, union } from 'ramda'

import { RootState } from '../store/rootReducer'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus
export const fullExifUploadList = (state: RootState) => state.uploadReducer.fullExifFilesList

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

export const allUploadKeywords = createSelector(fullExifUploadList, exifObj => {
  const getUniqArr = (keywordsArrays: string[][]) => reduce<string[], string[]>(union, [], keywordsArrays)
  return compose(
    getUniqArr,
    map(item => exifObj[item].Keywords || []),
    keys
  )(exifObj)
})
