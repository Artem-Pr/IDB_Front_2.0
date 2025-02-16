import type { Sort } from 'src/common/constants'
import type { SortingFields } from 'src/redux/types'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import type { Media, NullableMedia } from '../models/media'

interface UpdatedFields extends NonNullableFields<Pick<NullableMedia,
'originalName' | 'filePath' | 'originalDate' | 'keywords' | 'rating' | 'description' | 'timeStamp' | 'changeDate'>> {}

export interface UpdatedFileAPIRequest {
  id: Media['id']
  updatedFields: Partial<UpdatedFields>
}

export interface GetPhotosByTagsAPIRequest {
  filters: {
    rating? : number
    fileName?: string
    includeAllSearchTags?: boolean
    searchTags?: string[]
    excludeTags?: string[]
    mimetypes?: MimeTypes[]
    dateRange?: [string, string]
    description?: string
    anyDescription?: boolean
  }
  sorting: {
    sort: Partial<Record<SortingFields, Sort>>
    randomSort?: boolean
  }
  folders: {
    folderPath?: string
    showSubfolders?: boolean
    isDynamicFolders?: boolean
  }
  pagination: {
    page: number
    perPage: number
  }
  settings: {
    comparisonFolder?: string
    dontSavePreview?: boolean // TODO remove that field and related logic
    isFullSizePreview?: boolean
    isNameComparison?: boolean
  }
}
