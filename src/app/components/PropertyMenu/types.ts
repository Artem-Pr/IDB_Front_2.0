import { ReactNode } from 'react'

import type { Tags } from 'exiftool-vendored'

import type { Media } from 'src/api/models/media'

export interface MediaProperties extends Omit<
Media, 'id' | 'duplicates' | 'staticPath' | 'staticPreview'
> {
  videoDuration?: Tags['Duration']
  videoFrameRate?: Tags['VideoFrameRate']
  avgBitRate?: Tags['AvgBitrate']
}

export type FieldsLabels = {
  [key in keyof MediaProperties]: ReactNode
} & {
  description: string
  keywords: string[] | null
  size: number
  videoDuration: number
}

export type PropertiesFieldNames = {
  [key in keyof MediaProperties]: string
}
