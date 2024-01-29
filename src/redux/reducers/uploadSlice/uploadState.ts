import type { ExifFilesList, LoadingStatus, UploadingObject } from '../../types'
import { MainMenuKeys } from '../../types'

interface State {
  checkForDuplicatesOnlyInCurrentFolder: boolean
  fullExifFilesList: ExifFilesList
  isExifLoading: boolean
  openMenus: MainMenuKeys[]
  previewLoadingCount: number
  selectedList: number[]
  uploadingBlobs: Record<string, string>
  uploadingFiles: UploadingObject[]
  uploadingStatus: LoadingStatus
}

export const initialState: State = {
  checkForDuplicatesOnlyInCurrentFolder: false,
  fullExifFilesList: {},
  isExifLoading: false,
  openMenus: [MainMenuKeys.FOLDERS],
  previewLoadingCount: 0,
  selectedList: [],
  uploadingBlobs: {},
  uploadingFiles: [],
  uploadingStatus: 'empty',
}
