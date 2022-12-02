import {
  DownloadingObject,
  DownloadingRawObject,
  GalleryPagination,
  GallerySortingItem,
  MainMenuKeys,
  Preview,
} from '../../types'
import { MimeTypes } from '../../types/MimeTypes'
import { defaultGallerySortingList } from './helpers'

export interface State {
  rawFiles: DownloadingRawObject[]
  downloadingFiles: DownloadingObject[]
  dSelectedList: number[]
  dOpenMenus: MainMenuKeys[]
  searchMenu: {
    searchTags: string[]
    excludeTags: string[]
    mimetypes: MimeTypes[]
  }
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
    searchTags: [],
    excludeTags: [],
    mimetypes: [],
  },
  galleryPagination: {
    currentPage: 1,
    nPerPage: 50,
    resultsCount: 0,
    totalPages: 1,
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
