import React from 'react'

import { Switch } from 'antd'

import type { ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'

interface NotSupportedConditionProps {
  value: ExifFilterCondition
  onChange: (condition: ExifFilterCondition) => void
  propertyName: string
}

export const NotSupportedCondition: React.FC<NotSupportedConditionProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (checked: boolean) => {
    onChange({
      ...value,
      isExist: checked,
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch
        checked={value.isExist || false}
        onChange={handleChange}
        size="small"
      />
      <span>Property exists</span>
    </div>
  )
} 