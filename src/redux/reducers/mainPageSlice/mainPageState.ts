import {
  DownloadingObject,
  DownloadingRawObject,
  GalleryPagination,
  GallerySortingItem,
  MainMenuKeys,
  Preview,
} from '../../types'
import { defaultGallerySortingList } from './helpers'
import { SearchMenu } from './types'

export interface State {
  rawFiles: DownloadingRawObject[]
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: MainMenuKeys[]
  searchMenu: SearchMenu
  galleryPagination: GalleryPagination
  gallerySortingList: GallerySortingItem[]
  randomSort: boolean
  filesSizeSum: number
  isExifLoading: boolean
  isGalleryLoading: boolean
  isDeleteProcessing: boolean
  preview: Preview
}

export const initialState: State = {
  rawFiles: [],
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
  searchMenu: {
    fileName: '',
    includeAllSearchTags: true,
    searchTags: [],
    excludeTags: [],
    mimetypes: [],
    dateRange: null,
  },
  galleryPagination: {
    currentPage: 1,
    nPerPage: 50,
    resultsCount: 0,
    totalPages: 1,
    pageSizeOptions: [10, 20, 50, 100],
  },
  gallerySortingList: defaultGallerySortingList,
  randomSort: false,
  filesSizeSum: 0,
  isExifLoading: false,
  isGalleryLoading: false,
  isDeleteProcessing: false,
  preview: {
    previewType: undefined,
    originalName: '',
    originalPath: '',
  },
}
