import { ReactNode } from 'react'

import { FieldsObj } from '../../../redux/types'

export type FieldsLabels = {
  [key in keyof FieldsObj]: ReactNode
} & {
  description: string
  keywords: string[] | null
  size: number
}

export type FieldNames = {
  [key in keyof FieldsObj]: string
}
