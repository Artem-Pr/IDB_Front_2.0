import type { Media } from 'src/api/models/media'

import type {
  ExifFilesList, LoadingStatus, SortingData,
} from '../../types'
import { MainMenuKeys } from '../../types'

import { defaultGallerySortingList } from './helpers'

export interface State {
  checkForDuplicatesOnlyInCurrentFolder: boolean
  fullExifFilesList: ExifFilesList
  openMenus: MainMenuKeys[]
  previewLoadingCount: number
  selectedList: number[]
  uploadingBlobs: Record<string, string>
  uploadingFiles: Media[]
  uploadingStatus: LoadingStatus
  sort: SortingData
}

export const initialState: State = {
  checkForDuplicatesOnlyInCurrentFolder: false,
  fullExifFilesList: {},
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
