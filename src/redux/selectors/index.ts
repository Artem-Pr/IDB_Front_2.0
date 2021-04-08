import { RootState } from '../store/rootReducer'

export const folderTree = (state: RootState) => state.folderReducer.folderTree
export const currentFolderPath = (state: RootState) => state.folderReducer.currentFolderPath
