import { MimeTypes, ExifValueType } from 'src/common/constants'

export interface ExifFilterCondition {
  isExist?: boolean // for NOT_SUPPORTED type
  values?: (string | number)[] // for STRING, STRING_ARRAY, NUMBER (multiselect mode)
  textValue?: string // for LONG_STRING type
  rangeMode?: boolean // for NUMBER type
  rangeValues?: [number, number] // for NUMBER type in range mode
}

export interface ExifFilter {
  id: string // unique identifier for each filter
  propertyName: string // selected EXIF property name
  propertyType: ExifValueType // type of the EXIF property
  condition: ExifFilterCondition // filter condition based on property type
}

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
  exifFilters: ExifFilter[]
}
