import { createSelector } from 'reselect'

import { RootState } from '../store/rootReducer'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector
export const upload = (state: RootState) => state.uploadReducer
export const openMenus = (state: RootState) => state.uploadReducer.openMenus

export const pathsArrOptionsSelector = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))

export const uploadPageGalleryPropsSelector = createSelector(upload, ({ uploadingFiles, selectedList, openMenus }) => ({
  openMenus,
  selectedList,
  imageArr: uploadingFiles,
}))

// export const selectedElementsSelector = createSelector(upload, ({ selectedList, uploadingFiles }) => {
//   const selectedElementsMap: Map<number, UploadingObject> = new Map()
//   selectedList.forEach(index => selectedElementsMap.set(index, uploadingFiles[index]))
//   return selectedElementsMap
// })
