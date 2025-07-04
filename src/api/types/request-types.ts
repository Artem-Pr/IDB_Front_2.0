import type { Sort } from 'src/common/constants'
import { MimeTypes } from 'src/common/constants'
import type { SortingFields } from 'src/redux/types'

import type { Media, NullableMedia } from '../models/media'

interface UpdatedFields extends NonNullableFields<Pick<NullableMedia,
'originalName' | 'filePath' | 'originalDate' | 'keywords' | 'rating' | 'description' | 'timeStamp' | 'changeDate'>> {}

export interface UpdatedFileAPIRequest {
  id: Media['id']
  updatedFields: Partial<UpdatedFields>
}

interface Pagination {
  page: number
  perPage: number
}

export interface GetExifKeysAPIRequest extends Pagination {
  searchTerm?: string
}

export interface GetExifValuesAPIRequest extends Pagination {
  exifPropertyName: string
  searchTerm?: string
}

export interface GetExifValueRangeAPIRequest {
  exifPropertyName: string
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
  pagination: Pagination
}

export interface GetFilesDescriptionAPIRequest extends Pagination {
  descriptionPart: string
}
