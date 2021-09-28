export type Keywords = string[] | null
export type LoadingStatus = 'empty' | 'success' | 'error' | 'loading'
export type CheckboxType = 'isName' | 'isOriginalDate' | 'isKeywords' | 'isFilePath'
export type Checkboxes = Record<CheckboxType, boolean>

export interface NameParts {
  shortName: string
  ext: string
}

export interface FullExifObj {
  [key: string]: string | number | Keywords

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
  }
}

export interface GalleryPagination {
  currentPage: number
  nPerPage: number
  resultsCount: number
  totalPages: number
}

export interface FetchingGalleryContent {
  files: DownloadingRawObject[]
  searchPagination: GalleryPagination
}

export interface IGallery {
  thumbnail: string
  original: string
  renderItem?: () => any
}

export interface UpdatePhotosRequest {
  files?: DownloadingRawObject[]
  newFilePath?: string[]
  error?: string
}
