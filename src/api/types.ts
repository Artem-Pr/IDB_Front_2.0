import { MimeTypes } from '../redux/types/MimeTypes'
import { Sort, SortedFields } from '../redux/types'

export interface GetPhotosByTagsRequest {
  page: number
  perPage: number
  sorting: Partial<Record<SortedFields, Sort>>
  fileName?: string
  searchTags?: string[]
  excludeTags?: string[]
  mimeTypes?: MimeTypes[]
  folderPath?: string
  comparisonFolder?: string
  isNameComparison?: boolean
  showSubfolders?: boolean
  isFullSizePreview?: boolean
  randomSort?: boolean
  dontSavePreview?: boolean
}
