import { createSelector } from 'reselect'

import { RootState } from '../store/rootReducer'

export const folderTree = (state: RootState) => state.folderReducer.folderTree
export const currentFolderPath = (state: RootState) => state.folderReducer.currentFolderPath
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr

export const pathsArrOptions = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))
