import { MimeTypes } from 'src/common/constants'

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
