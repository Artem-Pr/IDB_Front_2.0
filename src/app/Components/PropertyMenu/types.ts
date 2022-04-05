import { ReactNode } from 'react'

import { ExtraDownloadingFields, UploadingObject } from '../../../redux/types'

export type FieldsObj = UploadingObject & ExtraDownloadingFields

export type FieldsLabels = {
  [key in keyof FieldsObj]: ReactNode
} & {
  keywords: string[] | null
  size: number
}

export type FieldNames = {
  [key in keyof FieldsObj]: string
}
