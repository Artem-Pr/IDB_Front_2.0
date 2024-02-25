import { MimeTypes } from '../../../redux/types/MimeTypes'

export interface RawPreview {
  fullSizeJpgStatic: string
  name: string
  originalPath: string | undefined
  preview: string
  type: MimeTypes
}
