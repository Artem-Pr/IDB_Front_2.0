import React, { useCallback, useMemo, useState, useRef } from 'react'

import { AutoComplete } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
import type { ExifKeyItem } from 'src/api/types/response-types'
import { useAutocompleteData } from 'src/app/common/hooks'
import { warningMessage } from 'src/app/common/notifications'

interface ExifPropertySelectorProps {
  value?: string
  onChange?: (propertyName: string, propertyType: any) => void
  excludedProperties?: string[]
  placeholder?: string
  disabled?: boolean
}

export const ExifPropertySelector: React.FC<ExifPropertySelectorProps> = ({
  value,
  onChange,
  excludedProperties = [],
  placeholder = "Select EXIF property",
  disabled = false,
}) => {
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false)
  
  // Store the mapping between property names and their types
  const keyDataRef = useRef<Map<string, ExifKeyItem>>(new Map())

  const searchFunction = useCallback(
    async (searchValue: string, page: number, perPage: number) => {
      try {
        const response = await mainApi.getExifKeys({
          searchTerm: searchValue,
          page,
          perPage,
        })
        
        // Store the key data for later type lookup
        response.data.exifKeys.forEach(key => {
          keyDataRef.current.set(key.name, key)
        })
        
        // Mark as initially fetched after first successful call
        if (!hasInitiallyFetched) {
          setHasInitiallyFetched(true)
        }
        
        return {
          data: {
            items: response.data.exifKeys,
            hasMore: response.data.page < response.data.totalPages,
          },
        }
      } catch (error) {
        warningMessage(error as Error, 'Failed to load EXIF properties')
        return {
          data: {
            items: [],
            hasMore: false,
          },
        }
      }
    },
    [hasInitiallyFetched]
  )

  const { options, loading, handleSearch, handlePopupScroll } = useAutocompleteData<ExifKeyItem>({
    searchFunction,
    pageSize: 50,
    debounceDelay: 500,
  })

  // Filter out excluded properties from options
  const filteredOptions = useMemo(
    () => options.filter(option => !excludedProperties.includes(option.value)),
    [options, excludedProperties]
  )

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      const keyData = keyDataRef.current.get(selectedValue)
      onChange(selectedValue, keyData?.type || 'STRING')
    }
  }

  const handleChange = (changedValue: string) => {
    if (onChange) {
      const keyData = keyDataRef.current.get(changedValue)
      onChange(changedValue, keyData?.type || 'STRING')
    }
  }

  // Fetch initial data when dropdown is opened for the first time
  const handleFocus = () => {
    if (!hasInitiallyFetched && !loading && filteredOptions.length === 0) {
      handleSearch('') // Trigger search with empty string to get initial data
    }
  }

  return (
    <AutoComplete
      value={value}
      options={filteredOptions}
      onSelect={handleSelect}
      onChange={handleChange}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      onFocus={handleFocus}
      placeholder={placeholder}
      disabled={disabled}
      notFoundContent={loading ? 'Loading...' : 'No EXIF properties found'}
      showSearch
      allowClear
      style={{ width: '100%' }}
    />
  )
} 