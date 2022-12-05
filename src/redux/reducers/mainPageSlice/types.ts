import { MimeTypes } from '../../types/MimeTypes'

export interface SearchMenu {
  fileName: string
  includeAllSearchTags: boolean
  searchTags: string[]
  excludeTags: string[]
  mimetypes: MimeTypes[]
  dateRange: [string, string] | null
}
