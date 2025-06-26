import React, { useEffect, useState } from 'react'

import { Select, Checkbox, InputNumber, Space } from 'antd'

import { mainApi } from 'src/api/requests/api-requests'
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
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [rangeInfo, setRangeInfo] = useState<{ min: number; max: number } | null>(null)
  const [rangeLoading, setRangeLoading] = useState(false)

  const isRangeMode = value.rangeMode || false

  // Fetch available number values for multiselect mode
  useEffect(() => {
    if (propertyName && !isRangeMode) {
      setLoading(true)
      mainApi.getExifValues({
        exifPropertyName: propertyName,
        page: 1,
        perPage: 100,
      })
        .then(response => {
          const values = response.data.values || []
          setOptions(values
            .filter(val => typeof val === 'number')
            .map(val => ({
              label: String(val),
              value: val as number,
            }))
          )
        })
        .catch(error => {
          warningMessage(error as Error, `Failed to load values for ${propertyName}`)
          setOptions([])
        })
        .finally(() => setLoading(false))
    }
  }, [propertyName, isRangeMode])

  // Fetch range info when switching to range mode
  useEffect(() => {
    if (propertyName && isRangeMode && !rangeInfo) {
      setRangeLoading(true)
      mainApi.getExifValueRange({
        exifPropertyName: propertyName,
      })
        .then(response => {
          setRangeInfo({
            min: response.data.minValue,
            max: response.data.maxValue,
          })
        })
        .catch(error => {
          warningMessage(error as Error, `Failed to load range for ${propertyName}`)
        })
        .finally(() => setRangeLoading(false))
    }
  }, [propertyName, isRangeMode, rangeInfo])

  const handleRangeModeChange = (checked: boolean) => {
    onChange({
      ...value,
      rangeMode: checked,
      rangeValues: checked ? [rangeInfo?.min || 0, rangeInfo?.max || 100] : undefined,
      values: checked ? undefined : [],
    })
  }

  const handleMultiselectChange = (selectedValues: number[]) => {
    onChange({
      ...value,
      values: selectedValues,
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
            mode="tags"
            style={{ width: '100%' }}
            placeholder={`Select ${propertyName} values`}
            value={value.values?.filter(v => typeof v === 'number') || []}
            onChange={handleMultiselectChange}
            options={options}
            loading={loading || rangeLoading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        )}
    </div>
  )
} 