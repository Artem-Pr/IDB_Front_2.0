import type { Media } from '../models/media'
import type { DuplicateFile } from '../types'

export interface UploadingFileAPIResponse {
  properties: Media;
}

export interface CheckOriginalNameDuplicatesAPIResponse extends Record<Media['originalName'], DuplicateFile[]> {}

export interface CheckedDirectoryAPIResponse {
  numberOfFiles: number
  numberOfSubdirectories: number
}

export interface UpdatePhotosAPIResponse {
  files?: Media[]
  newFilePath?: string[]
}
