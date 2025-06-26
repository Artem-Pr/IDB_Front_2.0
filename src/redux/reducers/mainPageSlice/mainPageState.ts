import type { Media } from 'src/api/models/media'
import { MainMenuKeys, MimeTypes } from 'src/common/constants'

import type {
  GalleryPagination,
  Preview,
  SortingData,
} from '../../types'

import { defaultGallerySortingList } from './helpers'
import type { SearchMenu } from './types'

export interface State {
  rawFiles: Media[]
  filesArr: Media[]
  selectedList: number[]
  openMenus: MainMenuKeys[]
  searchMenu: SearchMenu
  galleryPagination: GalleryPagination
  filesSizeSum: number
  isExifLoading: boolean
  isGalleryLoading: boolean
  isDeleteProcessing: boolean
  preview: Preview
  sort: SortingData
}

export const initialState: State = {
  rawFiles: [],
  filesArr: [],
  selectedList: [],
  openMenus: [],
  searchMenu: {
    rating: 0,
    fileName: '',
    includeAllSearchTags: true,
    searchTags: [],
    excludeTags: [],
    mimetypes: [],
    dateRange: null,
    anyDescription: false,
    description: '',
    exifFilters: [],
  },
  galleryPagination: {
    currentPage: 1,
    nPerPage: 50,
    resultsCount: 0,
    totalPages: 1,
    pageSizeOptions: [10, 20, 50, 100],
  },
  filesSizeSum: 0,
  isExifLoading: false,
  isGalleryLoading: false,
  isDeleteProcessing: false,
  preview: {
    originalName: '',
    previewType: MimeTypes.jpeg,
    staticPath: '',
    staticPreview: '',
    staticVideoFullSize: null,
    stop: false,
  },
  sort: {
    gallerySortingList: defaultGallerySortingList,
    randomSort: false,
    groupedByDate: false,
  },
}
