import React, { useEffect, useState } from 'react'

import { Select } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
import { warningMessage } from 'src/app/common/notifications'
import type { ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

interface StringConditionProps {
  value: ExifFilterCondition
  onChange: (condition: ExifFilterCondition) => void
  propertyName: string
}

export const StringCondition: React.FC<StringConditionProps> = ({
  value,
  onChange,
  propertyName,
}) => {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (propertyName) {
      setLoading(true)
      mainApi.getExifValues({
        exifPropertyName: propertyName,
        page: 1,
        perPage: 100, // Get more values for string fields
      })
        .then(response => {
          const values = response.data.values || []
          setOptions(values.map(val => ({
            label: String(val),
            value: val,
          })))
        })
        .catch(error => {
          warningMessage(error as Error, `Failed to load values for ${propertyName}`)
          setOptions([])
        })
        .finally(() => setLoading(false))
    }
  }, [propertyName])

  const handleChange = (selectedValues: (string | number)[]) => {
    onChange({
      ...value,
      values: selectedValues,
    })
  }

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder={`Select ${propertyName} values`}
      value={value.values || []}
      onChange={handleChange}
      options={options}
      loading={loading}
      allowClear
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase()
          .includes(input.toLowerCase())
      }
    />
  )
} 