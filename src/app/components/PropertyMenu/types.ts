import { ReactNode } from 'react'

import type { Media } from 'src/api/models/media'

export interface MediaProperties extends Omit<
Media, 'id' | 'duplicates' | 'staticPath' | 'staticPreview'
> {}

export type FieldsLabels = {
  [key in keyof MediaProperties]: ReactNode
} & {
  description: string
  keywords: string[] | null
  size: number
}

export type PropertiesFieldNames = {
  [key in keyof MediaProperties]: string
}
