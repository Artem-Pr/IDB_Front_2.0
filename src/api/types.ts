import { MimeTypes } from '../redux/types/MimeTypes'

export interface GetPhotosByTagsRequest {
  page: number
  perPage: number
  searchTags?: string[]
  excludeTags?: string[]
  mimeTypes?: MimeTypes[]
  folderPath?: string
  comparisonFolder?: string
  isNameComparison?: boolean
  showSubfolders?: boolean
  isFullSizePreview?: boolean
}
