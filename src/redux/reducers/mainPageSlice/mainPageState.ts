import type { Media } from 'src/api/models/media'
import { MainMenuKeys } from 'src/common/constants'

import type {
  GalleryPagination,
  Preview,
  SortingData,
} from '../../types'
import { MimeTypes } from '../../types/MimeTypes'

import { defaultGallerySortingList } from './helpers'
import type { SearchMenu } from './types'

export interface State {
  rawFiles: Media[]
  downloadingFiles: Media[]
  dSelectedList: number[]
  dOpenMenus: MainMenuKeys[]
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
  downloadingFiles: [],
  dSelectedList: [],
  dOpenMenus: [],
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
