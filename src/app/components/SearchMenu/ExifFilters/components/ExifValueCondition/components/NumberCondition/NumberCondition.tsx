import React, { useCallback, useEffect, useState } from 'react'

import { Select, Checkbox, InputNumber, Space } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
import { useAutocompleteData } from 'src/app/common/hooks/useAutocompleteData'
import { warningMessage } from 'src/app/common/notifications'
import type { ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

import styles from './NumberCondition.module.scss'

interface NumberConditionProps {
  value: ExifFilterCondition
  onChange: (condition: ExifFilterCondition) => void
  propertyName: string
}

export const NumberCondition: React.FC<NumberConditionProps> = ({
  value,
  onChange,
  propertyName,
}) => {
  const [rangeInfo, setRangeInfo] = useState<{ min: number; max: number } | null>(null)
  const [rangeLoading, setRangeLoading] = useState(false)

  const isRangeMode = value.rangeMode || false

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

  // Fetch range info when switching to range mode, and clean it up when mode is disabled or property changes.
  useEffect(() => {
    if (propertyName && isRangeMode) {
      setRangeLoading(true)
      mainApi.getExifValueRange({
        exifPropertyName: propertyName,
      })
        .then(response => {
          const { minValue, maxValue } = response.data
          setRangeInfo({
            min: minValue,
            max: maxValue,
          })
          onChange({
            ...value,
            rangeValues: [minValue, maxValue],
          })
        })
        .catch(error => {
          warningMessage(error as Error, `Failed to load range for ${propertyName}`)
          setRangeInfo(null)
        })
        .finally(() => setRangeLoading(false))
    } else {
      setRangeInfo(null)
    }
  }, [propertyName, isRangeMode])

  const handleRangeModeChange = (checked: boolean) => {
    onChange({
      ...value,
      rangeMode: checked,
      rangeValues: undefined,
      values: checked ? undefined : [],
    })
  }

  const handleMultiselectChange = (selectedValues: string[]) => {
    const validNumbers = selectedValues
      .map(Number)
      .filter(num => !isNaN(num))
      
    onChange({
      ...value,
      values: validNumbers,
    })
  }

  const handleRangeChange = (index: 0 | 1, newValue: number | null) => {
    if (newValue !== null) {
      const currentRange = value.rangeValues || [rangeInfo?.min || 0, rangeInfo?.max || 100]
      const newRange: [number, number] = [...currentRange] as [number, number]
      newRange[index] = newValue
      
      onChange({
        ...value,
        rangeValues: newRange,
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.rangeModeToggle}>
        <Checkbox
          checked={isRangeMode}
          onChange={e => handleRangeModeChange(e.target.checked)}
        >
          Range mode
        </Checkbox>
        {rangeInfo && (
          <span className={styles.rangeInfo}>
            (Range: {rangeInfo.min} - {rangeInfo.max})
          </span>
        )}
      </div>

      {isRangeMode 
        ? (
          <Space.Compact style={{ width: '100%' }}>
            <InputNumber
              placeholder="Min"
              value={value.rangeValues?.[0]}
              onChange={val => handleRangeChange(0, val)}
              min={rangeInfo?.min}
              max={rangeInfo?.max}
              style={{ width: '50%' }}
            />
            <InputNumber
              placeholder="Max"
              value={value.rangeValues?.[1]}
              onChange={val => handleRangeChange(1, val)}
              min={rangeInfo?.min}
              max={rangeInfo?.max}
              style={{ width: '50%' }}
            />
          </Space.Compact>
        ) 
        : (
          <Select
            allowClear
            filterOption={false}
            loading={loading || rangeLoading}
            mode="multiple"
            notFoundContent={loading ? 'Loading...' : 'No results'}
            onChange={handleMultiselectChange}
            onFocus={handleFocus}
            onPopupScroll={handlePopupScroll}
            onSearch={handleSearch}
            options={options}
            placeholder={`Select ${propertyName} values`}
            showSearch
            style={{ width: '100%' }}
            value={value.values?.map(String) || []}
          />
        )}
    </div>
  )
} 