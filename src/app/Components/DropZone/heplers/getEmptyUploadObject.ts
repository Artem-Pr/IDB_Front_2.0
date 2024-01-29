import { UploadingObject } from '../../../../redux/types'
import { MimeTypes } from '../../../../redux/types/MimeTypes'

export const getEmptyUploadObject = ({ type, name }: { type: MimeTypes; name: string }): UploadingObject => ({
  DBFullPath: '',
  DBFullPathFullSize: '',
  changeDate: 0,
  description: '',
  fullSizeJpgPath: '',
  keywords: null,
  megapixels: '',
  name,
  originalDate: '-',
  originalPath: '',
  preview: '',
  rating: 0,
  size: 0,
  tempPath: '',
  type,
})
