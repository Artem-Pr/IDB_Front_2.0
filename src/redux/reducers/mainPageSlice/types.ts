import type { FullExifObj } from 'src/redux/types'

import { MimeTypes } from '../../types/MimeTypes'

export interface SearchMenu {
  rating: number
  fileName: string
  includeAllSearchTags: boolean
  searchTags: string[]
  excludeTags: string[]
  mimetypes: MimeTypes[]
  dateRange: [string, string] | null
  anyDescription: boolean
  description: string
}

export interface FullExifPayload {
  filePath: string
  fullExifObj: FullExifObj
}
