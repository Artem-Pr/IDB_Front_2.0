export type AxiosPreviews = {
  preview: string
  tempPath: string
}

export interface FolderTreeItem {
  title: string
  key: string
  children?: FolderTreeItem[]
}

export interface UploadingObject extends AxiosPreviews {
  changeDate: string
  originalDate: string
  keywords: string[] | null
  megapixels: number | ''
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
