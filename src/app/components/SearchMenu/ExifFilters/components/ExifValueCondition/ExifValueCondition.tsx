import React from 'react'

import { ExifValueType } from 'src/common/constants'
import type { ExifFilter, ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

import { LongStringCondition } from './components/LongStringCondition'
import { NotSupportedCondition } from './components/NotSupportedCondition'
import { NumberCondition } from './components/NumberCondition/NumberCondition'
import { StringCondition } from './components/StringCondition'

interface ExifValueConditionProps {
  filter: ExifFilter
  onChange: (condition: ExifFilterCondition) => void
}

export const ExifValueCondition: React.FC<ExifValueConditionProps> = ({
  filter,
  onChange,
}) => {
  // Only render condition component if property is selected
  if (!filter.propertyName || !filter.propertyType) {
    return null
  }

  const commonProps = {
    value: filter.condition,
    onChange,
    propertyName: filter.propertyName,
  }

  switch (filter.propertyType) {
  case ExifValueType.NOT_SUPPORTED:
    return <NotSupportedCondition {...commonProps} />
    
  case ExifValueType.LONG_STRING:
    return <LongStringCondition {...commonProps} />
    
  case ExifValueType.STRING_ARRAY:
  case ExifValueType.STRING:
    return <StringCondition {...commonProps} />
    
  case ExifValueType.NUMBER:
    return <NumberCondition {...commonProps} />
    
  default:
    return null
  }
} 