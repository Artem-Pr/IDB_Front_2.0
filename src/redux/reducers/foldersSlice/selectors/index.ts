import { createSelector } from 'reselect'

import type { Media } from 'src/api/models/media'
import { getUpdatedPathsArrFromMediaList } from 'src/app/common/folderTree'
import type { RootState } from 'src/redux/store/types'

export const getFolderReducerFolderTree = (state: RootState) => state.foldersSliceReducer.folderTree
export const getFolderReducerFolderPathsArr = (state: RootState) => state.foldersSliceReducer.pathsArr
export const getFolderReducerKeywordsList = (state: RootState) => state.foldersSliceReducer.keywordsList
export const getFolderReducerFolderInfoShowInfoModal = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.showInfoModal
)
export const getFolderReducerFolderInfoNumberOfFiles = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.numberOfFiles
)
export const getFolderReducerFolderInfoNumberOfSubdirs = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.numberOfSubdirectories
)
export const getFolderReducerFolderInfoCurrentFolder = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.currentFolderPath
)
export const getFolderReducerFolderInfoShowSubfolders = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.showSubfolders
)
export const getFolderReducerFolderInfoIsDynamicFolders = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.isDynamicFolders
)
export const getFolderReducerFolderInfoCurrentFolderKey = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.currentFolderKey
)
export const getFolderReducerFolderInfoExpandedKeys = (state: RootState) => (
  state.foldersSliceReducer.currentFolderInfo.expandedKeys
)

export const getFolderReducerUpdatedPathsArrFromMediaList = createSelector([
  getFolderReducerFolderPathsArr,
  (_state: RootState, mediaList: Media[]) => mediaList,
], (actualPathsArr, mediaList) => (
  getUpdatedPathsArrFromMediaList(mediaList, actualPathsArr)
))

export const getFolderReducerPathsArrOptionsSelector = createSelector(getFolderReducerFolderPathsArr, pathsArrSelector => (
  pathsArrSelector
    .map(path => ({ value: path }))
))
