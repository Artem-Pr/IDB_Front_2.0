import React, { useCallback } from 'react'

import { Select } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
import { useAutocompleteData } from 'src/app/common/hooks/useAutocompleteData'
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
  const searchFunction = useCallback(async (searchValue: string, page: number, perPage: number) => {
    const response = await mainApi.getExifValues({
      exifPropertyName: propertyName,
      searchTerm: searchValue,
      page,
      perPage,
    })
    
    return {
      data: {
        items: response.data.values.map(val => ({ value: String(val) })),
        hasMore: response.data.values.length === perPage,
      },
    }
  }, [propertyName])
  
  const {
    options,
    loading,
    handleSearch,
    handlePopupScroll,
    handleFocus,
  } = useAutocompleteData({ searchFunction })

  const handleChange = (selectedValues: (string | number)[]) => {
    onChange({
      ...value,
      values: selectedValues,
    })
  }

  return (
    <Select
      allowClear
      filterOption={false}
      loading={loading}
      mode="multiple"
      notFoundContent={loading ? 'Loading...' : 'No results'}
      onChange={handleChange}
      onFocus={handleFocus}
      onPopupScroll={handlePopupScroll}
      onSearch={handleSearch}
      options={options}
      placeholder={`Select ${propertyName} values`}
      showSearch
      style={{ width: '100%' }}
      value={value.values || []}
    />
  )
} 