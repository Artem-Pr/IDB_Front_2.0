export type Keywords = string[] | null
export type LoadingStatus = 'empty' | 'success' | 'error' | 'loading'
export type CheckboxType = 'isName' | 'isOriginalDate' | 'isKeywords' | 'isFilePath' | 'isDescription' | 'isRating'
export type Checkboxes = Record<CheckboxType, boolean>
export type DeleteConfirmationType = 'file' | 'directory' | 'keyword'
export type FieldsObj = UploadingObject & ExtraDownloadingFields
export type PreviewType = 'video' | 'image' | undefined

export enum PagePaths {
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
}

export interface FullExifObj {
  [key: string]: string | number | Keywords

  Rating: number
  Description: string
  Keywords: Keywords
  Megapixels: number | ''
  DateTimeOriginal: string
}

export type ExifFilesList = Record<string, FullExifObj>

export interface AxiosPreviews {
  preview: string
  tempPath: string
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

export interface UploadingObject extends AxiosPreviews, UpdatingFields {
  changeDate: number
  name: string
  size: number
  type: string
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
    AxiosPreviews,
    Omit<DownloadingObject, keyof UploadingObject> {
  changeDate: number
  mimetype: string
  originalName: string
  size: number
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
  expandedKeys: React.Key[]
  showInfoModal: boolean
  showSubfolders: boolean
}

export interface Preview {
  previewType: PreviewType
  originalPath: string | undefined
  originalName: string
}

export interface BlobDispatchPayload {
  name: string
  originalPath: string
}
