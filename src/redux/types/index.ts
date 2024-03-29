import type { Key } from 'react'

import { MimeTypes } from './MimeTypes'

export type { Duration } from 'dayjs/plugin/duration'

export type Defined<T> = Exclude<T, undefined>
export type Keywords = string[] | null
export type LoadingStatus = 'empty' | 'success' | 'error' | 'loading'
export type CheckboxType =
  | 'isName'
  | 'isOriginalDate'
  | 'isKeywords'
  | 'isFilePath'
  | 'isDescription'
  | 'isRating'
  | 'isTimeStamp'
  | 'needUpdatePreview'
export type Checkboxes = Record<CheckboxType, boolean>
export type DeleteConfirmationType = 'file' | 'directory' | 'keyword'
export type FieldsObj = UploadingObject & ExtraDownloadingFields
export type PreviewType = 'video' | 'image' | undefined

export enum PagePaths {
  DEFAULT = '/IDB_Front_2.0',
  MAIN = '/',
  UPLOAD = '/upload',
  SETTINGS = '/settings',
  TEST_DB = '/test-db',
}

export enum MainMenuKeys {
  SORT = 'sort',
  FILTER = 'filter',
  FOLDERS = 'folders',
  PROPERTIES = 'properties',
  EDIT = 'edit',
  EDIT_BULK = 'edit-bulk',
  KEYWORDS = 'keywords',
  PREVIEW = 'preview',
  BUTTONS_MENU = 'buttons-menu',
  DUPLICATES = 'duplicates',
}

export enum SortedFields {
  ID = '_id',
  MEGAPIXELS = 'megapixels',
  MIMETYPE = 'mimetype',
  ORIGINAL_DATE = 'originalDate',
  ORIGINAL_NAME = 'originalName',
  FILE_PATH = 'filePath',
  SIZE = 'size',
  RATING = 'rating',
  DESCRIPTION = 'description',
  NAME = 'name',
  TYPE = 'type',
}

export enum Sort {
  ASC = 1,
  DESC = -1,
}

export interface GallerySortingItem {
  id: SortedFields
  label: string
  sort: Sort | null
}

export interface NameParts {
  shortName: string
  ext: string
  extWithoutDot?: string
}

export interface ExifDateTime {
  [key: string]: string | number | undefined
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number | undefined
  tzoffsetMinutes: number | undefined
  rawValue: string
  zoneName: string | undefined
}

export type GPSCoordinates = Pick<FullExifBasic, 'GPSLatitude' | 'GPSLongitude'>

export interface FullExifBasic {
  Rating: number
  Description: string
  Keywords: Keywords | string
  Subject: Keywords
  Megapixels: number | ''
  DateTimeOriginal: ExifDateTime
  CreateDate: ExifDateTime
  CreationDate: ExifDateTime // original date for iPhone video
  GPSLatitude?: number
  GPSLongitude?: number
}

export interface FullExifObj extends FullExifBasic {
  [key: string]: string | number | Keywords | ExifDateTime | undefined
}

export type RawDataValue = undefined | string | number | Keywords | ExifDateTime | Record<string, string | number>

export interface RawFullExifObj extends FullExifBasic {
  [key: string]: RawDataValue
}

export type ExifFilesList = Record<string, RawFullExifObj | undefined>

type ExistedFilesFieldNames = 'filePath' | 'fullSizeJpgPath' | 'originalName' | 'originalPath' | 'preview'

export type ExistedFile = Record<ExistedFilesFieldNames, string>

export interface AxiosPreviews {
  DBFullPath: string // "/60dcc5bc4f211eabf8de258d1172a5f8-preview.jpg"
  DBFullPathFullSize: string // "/60dcc5bc4f211eabf8de258d1172a5f8-fullSize.jpg"
  fullSizeJpg: string // "http://localhost:5000/upload_images/60dcc5bc4f211eabf8de258d1172a5f8-fullSize.jpg"
  fullSizeJpgPath: string // "uploadTemp/60dcc5bc4f211eabf8de258d1172a5f8-fullSize.jpg"
  preview: string // "http://localhost:5000/upload_images/60dcc5bc4f211eabf8de258d1172a5f8-preview.jpg"
  tempPath: string // "uploadTemp/60dcc5bc4f211eabf8de258d1172a5f8"
  existedFilesArr?: ExistedFile[]
}

export interface UpdatingFields {
  rating: number
  description: string
  originalDate: string
  keywords: Keywords
  megapixels: number | ''
}

export interface UpdatingFieldsWithPath extends UpdatingFields {
  tempPath: string
}

export interface FolderTreeItem {
  title: string
  key: string
  children?: FolderTreeItem[]
}

export interface UploadingObject extends Omit<AxiosPreviews, 'fullSizeJpg'>, UpdatingFields {
  changeDate: number
  name: string
  size: number
  type: MimeTypes
  originalPath?: string
  timeStamp?: string
  needUpdatePreview?: boolean
}

export interface ExtraDownloadingFields {
  _id?: string
  filePath?: string
  imageSize?: string
  originalPath?: string
}

export interface DownloadingObject extends UploadingObject {
  _id: string
  filePath: string
  imageSize: string
  originalPath: string
}

export interface DownloadingRawObject
  extends UpdatingFields,
  Omit<AxiosPreviews, 'fullSizeJpg'>,
  Omit<DownloadingObject, keyof UploadingObject> {
  changeDate: number
  mimetype: MimeTypes
  originalName: string
  size: number
  originalPath: string
  timeStamp: string
  needUpdatePreview: boolean
}

export interface UpdatedObject {
  id: string
  updatedFields: {
    originalName?: string
    filePath?: string
    originalDate?: string
    keywords?: string[]
    rating?: number
    description?: string
    timeStamp?: string
    needUpdatePreview?: boolean
  }
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
  files: DownloadingRawObject[]
  filesSizeSum: number
  searchPagination: GalleryPagination
}

export interface IGallery {
  thumbnail: string
  original: string
  renderItem?: () => any
}

export interface QueryResponse {
  error?: string
  success?: string
}

export interface UpdatePhotosRequest extends QueryResponse {
  files?: DownloadingRawObject[]
  newFilePath?: string[]
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
  originalName: string
  originalPath: string | undefined
  playing?: boolean
  preview: string
  previewType: MimeTypes
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
