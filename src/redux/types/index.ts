export type Keywords = string[] | null

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
  changeDate: string
  name: string
  size: number
  type: string
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
