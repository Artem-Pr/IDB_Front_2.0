import React, { useCallback } from 'react'

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

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
  const textValues = value.textValues || ['']

  const searchFunction = useCallback(
    async (searchValue: string, page: number, perPage: number) => {
      try {
        const response = await mainApi.getExifValues({
          exifPropertyName: propertyName,
          page,
          perPage,
          searchTerm: searchValue,
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

  const handleChange = (index: number, newValue: string) => {
    const newTextValues = [...textValues]
    newTextValues[index] = newValue
    onChange({
      ...value,
      textValues: newTextValues,
    })
  }

  const handleAdd = () => {
    onChange({
      ...value,
      textValues: [...textValues, ''],
    })
  }

  const handleRemove = (index: number) => {
    const newTextValues = [...textValues]
    newTextValues.splice(index, 1)
    onChange({
      ...value,
      textValues: newTextValues,
    })
  }

  return (
    <div className="d-flex flex-column gap-10">
      {textValues.map((text, index) => (
        <div key={index} className="d-flex align-items-center gap-10">
          <AutoCompleteTextArea
            placeholder={`Enter ${propertyName} value`}
            value={text}
            onChange={newValue => handleChange(index, newValue)}
            searchFunction={searchFunction}
            notFoundText={`No ${propertyName} values found`}
            pageSize={50}
            debounceDelay={500}
          />
          {textValues.length > 1 && (
            <MinusCircleOutlined
              className="dynamic-delete-button"
              onClick={() => handleRemove(index)}
            />
          )}
        </div>
      ))}
      <Button
        type="dashed"
        onClick={handleAdd}
        icon={<PlusOutlined />}
      >
        {`Add ${propertyName} value`}
      </Button>
    </div>
  )
} 