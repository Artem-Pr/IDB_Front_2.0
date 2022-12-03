import { MimeTypes } from '../../types/MimeTypes'

export interface SearchMenu {
  searchTags: string[]
  excludeTags: string[]
  mimetypes: MimeTypes[]
}
