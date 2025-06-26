import React, { useCallback } from 'react'

import { mainApi } from 'src/api/requests/api-requests'
import { warningMessage } from 'src/app/common/notifications'
import { AutoCompleteTextArea } from 'src/app/components/UIKit'
import type { ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

interface LongStringConditionProps {
  value: ExifFilterCondition
  onChange: (condition: ExifFilterCondition) => void
  propertyName: string
}

export const LongStringCondition: React.FC<LongStringConditionProps> = ({
  value,
  onChange,
  propertyName,
}) => {
  const searchFunction = useCallback(
    async (searchValue: string, page: number, perPage: number) => {
      try {
        const response = await mainApi.getExifValues({
          exifPropertyName: propertyName,
          page,
          perPage,
        })
        
        const values = response.data.values || []
        // Filter values to only include strings for text search
        const stringValues = values.filter(val => typeof val === 'string')
        
        return {
          data: {
            items: stringValues,
            hasMore: response.data.page < response.data.totalPages,
          },
        }
      } catch (error) {
        warningMessage(error as Error, `Failed to load values for ${propertyName}`)
        return {
          data: {
            items: [],
            hasMore: false,
          },
        }
      }
    },
    [propertyName]
  )

  const handleChange = (textValue: string) => {
    onChange({
      ...value,
      textValue,
    })
  }

  return (
    <AutoCompleteTextArea
      placeholder={`Enter ${propertyName} value`}
      value={value.textValue || ''}
      onChange={handleChange}
      searchFunction={searchFunction}
      notFoundText={`No ${propertyName} values found`}
      pageSize={50}
      debounceDelay={500}
    />
  )
} 