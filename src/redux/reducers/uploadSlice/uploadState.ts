import type { Media } from 'src/api/models/media'
import { MainMenuKeys } from 'src/common/constants'

import type { LoadingStatus, SortingData } from '../../types'

import { defaultGallerySortingList } from './helpers'

export interface State {
  checkForDuplicatesOnlyInCurrentFolder: boolean
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
