import { ReactNode } from 'react'

import { FieldsObj } from '../../../redux/types'

type OmittedFieldsObj = Omit<FieldsObj, 'existedFilesArr'>

export type FieldsLabels = {
  [key in keyof OmittedFieldsObj]: ReactNode
} & {
  description: string
  keywords: string[] | null
  size: number
}

export type FieldNames = {
  [key in keyof OmittedFieldsObj]: string
}
