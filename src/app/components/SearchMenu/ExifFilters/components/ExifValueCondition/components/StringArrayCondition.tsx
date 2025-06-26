import React, { useEffect, useState } from 'react'

import { Select } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
import { warningMessage } from 'src/app/common/notifications'
import type { ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

interface StringArrayConditionProps {
  value: ExifFilterCondition
  onChange: (condition: ExifFilterCondition) => void
  propertyName: string
}

export const StringArrayCondition: React.FC<StringArrayConditionProps> = ({
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
        perPage: 200, // Array fields might have more unique values
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
      mode="multiple"
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
      maxTagCount="responsive"
    />
  )
} 