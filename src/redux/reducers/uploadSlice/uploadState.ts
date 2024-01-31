import type { ExifFilesList, LoadingStatus, SortingData, UploadingObject } from '../../types'
import { MainMenuKeys } from '../../types'
import { defaultGallerySortingList } from './helpers'

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
  sort: SortingData
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
  sort: {
    gallerySortingList: defaultGallerySortingList,
    groupedByDate: false,
  },
}
