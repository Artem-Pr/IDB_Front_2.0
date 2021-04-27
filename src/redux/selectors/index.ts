import { createSelector } from 'reselect'

import { RootState } from '../store/rootReducer'

export const folderElement = (state: RootState) => state.folderReducer
export const pathsArr = (state: RootState) => state.folderReducer.pathsArr // TODO: used only in another selector

export const pathsArrOptions = createSelector(pathsArr, pathsArr => pathsArr.map(path => ({ value: path })))
