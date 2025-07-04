import type { Key } from 'react'

import type { Media, SupportedExt, Tags } from 'src/api/models/media'
import type { MimeTypes, Sort } from 'src/common/constants'

export type { Duration } from 'dayjs/plugin/duration'

export type Defined<T> = Exclude<T, undefined>
export type Keywords = string[] | null | undefined
export type LoadingStatus = 'empty' | 'success' | 'error' | 'loading'
export type CheckboxType =
  | 'isName'
  | 'isOriginalDate'
  | 'isKeywords'
  | 'isFilePath'
  | 'isDescription'
  | 'isRating'
  | 'isTimeStamp'
export type Checkboxes = Record<CheckboxType, boolean>
export type DeleteConfirmationType = 'file' | 'directory' | 'keyword'
export type SortingFields = Exclude<keyof Media, 'staticPath' | 'staticPreview' | 'timeStamp' | 'duplicates' | 'keywords' | 'imageSize' | 'changeDate' | 'exif'>
export interface GallerySortingItem {
  id: SortingFields
  label: string
  sort: Sort | null
}

export interface NameParts {
  shortName: string
  ext: `.${SupportedExt}` | ''
  extWithoutDot?: SupportedExt
}

export type GPSCoordinates = Pick<Tags, 'GPSLatitude' | 'GPSLongitude'>

export interface FolderTreeItem {
  title: string
  key: string
  children?: FolderTreeItem[]
}

export interface GalleryPagination {
  currentPage: number
  nPerPage: number
  resultsCount: number
  totalPages: number
  pageSizeOptions: number[]
}

export interface FetchingGalleryContent {
  dynamicFolders: string[] | false
  files: Media[]
  filesSizeSum: number
  searchPagination: GalleryPagination
}

export interface QueryResponse {
  error?: string
  success?: string
}

export interface CheckedDirectoryRequest extends QueryResponse {
  numberOfFiles: number
  numberOfSubdirectories: number
}

export interface DirectoryInfo extends CheckedDirectoryRequest {
  currentFolderPath: string
  currentFolderKey: string
  expandedKeys: Key[]
  showInfoModal: boolean
  showSubfolders: boolean
  isDynamicFolders: boolean
}

export interface Preview {
  exif?: Media['exif']
  originalName: Media['originalName'] | ''
  playing?: boolean
  previewType: MimeTypes
  staticPath: Media['staticPath']
  staticPreview: Media['staticPreview']
  staticVideoFullSize: Media['staticVideoFullSize']
  stop?: boolean
}

export interface BlobDispatchPayload {
  name: string
  originalPath: string
}

export interface BlobUpdateNamePayload {
  oldName: string
  newName: string
}

export interface SortingData {
  gallerySortingList: GallerySortingItem[]
  groupedByDate: boolean
  randomSort?: boolean
}
