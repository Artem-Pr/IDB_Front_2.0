import React, { ReactNode } from 'react'
import { Tag } from 'antd'

import { formatSize } from '../../../common/utils'
import { FieldsLabels } from '../types'

export const getLabelValue = (fieldName: keyof FieldsLabels, fieldsObj: Partial<FieldsLabels>): ReactNode => {
  switch (fieldName) {
    case 'keywords':
      return fieldsObj.keywords?.map(keyword => <Tag key={keyword}>{keyword}</Tag>)
    case 'size':
      return formatSize(fieldsObj.size || 0)
    default:
      return fieldsObj[fieldName]
  }
}
