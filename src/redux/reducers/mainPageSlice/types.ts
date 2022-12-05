import { MimeTypes } from '../../types/MimeTypes'

export interface SearchMenu {
  fileName: string
  searchTags: string[]
  excludeTags: string[]
  mimetypes: MimeTypes[]
  dateRange: [string, string] | null
}
