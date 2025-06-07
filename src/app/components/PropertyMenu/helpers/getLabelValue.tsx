import React, { ReactNode } from 'react'

import { Rate, Tag, Input } from 'antd'

import { formatSize } from 'src/app/common/utils'
import { getDurationString } from 'src/app/common/utils/date'

import type { FieldsLabels } from '../types'

const { TextArea } = Input

export const getLabelValue = (fieldName: keyof FieldsLabels, fieldsObj: Partial<FieldsLabels>): ReactNode => {
  switch (fieldName) {
  case 'keywords':
    return fieldsObj.keywords?.length ? fieldsObj.keywords.map(keyword => <Tag key={keyword}>{keyword}</Tag>) : undefined
  case 'size':
    return formatSize(fieldsObj.size || 0)
  case 'rating':
    return typeof fieldsObj[fieldName] === 'string'
      ? (
        fieldsObj[fieldName]
      )
      : (
        <Rate value={(fieldsObj[fieldName] as number) || undefined} disabled />
      )
  case 'description':
    return <TextArea style={{ resize: 'vertical' }} value={fieldsObj[fieldName]} disabled />
  case 'videoDuration':
    return getDurationString(fieldsObj[fieldName])
  default:
    return fieldsObj[fieldName]
  }
}
