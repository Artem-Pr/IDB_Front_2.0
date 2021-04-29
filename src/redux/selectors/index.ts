import { createSelector } from 'reselect'

import { RootState } from '../store/rootReducer'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector
export const upload = (state: RootState) => state.uploadReducer

export const pathsArrOptions = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))
export const uploadPageGalleryProps = createSelector(upload, ({ uploadingFiles, selectedList, edit }) => ({
  ...edit,
  imageArr: uploadingFiles,
  selectedList,
}))
