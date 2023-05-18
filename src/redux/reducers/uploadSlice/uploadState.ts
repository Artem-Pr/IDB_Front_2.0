import type { ExifFilesList, LoadingStatus, UploadingObject } from '../../types'
import { MainMenuKeys } from '../../types'

interface State {
  uploadingFiles: UploadingObject[]
  uploadingBlobs: Record<string, string>
  fullExifFilesList: ExifFilesList
  selectedList: number[]
  openMenus: MainMenuKeys[]
  isExifLoading: boolean
  previewLoadingCount: number
  uploadingStatus: LoadingStatus
}

export const initialState: State = {
  uploadingFiles: [],
  uploadingBlobs: {},
  fullExifFilesList: {},
  selectedList: [],
  openMenus: [MainMenuKeys.FOLDERS],
  isExifLoading: false,
  previewLoadingCount: 0,
  uploadingStatus: 'empty',
}
