import React from 'react'

import { DeleteOutlined } from '@ant-design/icons'
import { Button, Switch } from 'antd'

import { mainPageReducerRemoveExifFilter, mainPageReducerUpdateExifFilter } from 'src/redux/reducers/mainPageSlice'
import type { ExifFilter, ExifFilterCondition } from 'src/redux/reducers/mainPageSlice/types'
import { useAppDispatch } from 'src/redux/store/store'

import { ExifPropertySelector } from '../ExifPropertySelector/ExifPropertySelector'
import { ExifValueCondition } from '../ExifValueCondition/ExifValueCondition'

import styles from './ExifFilterItem.module.scss'

interface ExifFilterItemProps {
  filter: ExifFilter
  usedPropertyNames: string[]
}

export const ExifFilterItem: React.FC<ExifFilterItemProps> = ({
  filter,
  usedPropertyNames,
}) => {
  const dispatch = useAppDispatch()

  const handleRemoveFilter = () => {
    dispatch(mainPageReducerRemoveExifFilter(filter.id))
  }

  const handleDisabledChange = (isDisabled: boolean) => {
    dispatch(mainPageReducerUpdateExifFilter({
      id: filter.id,
      updates: {
        isDisabled,
      },
    }))
  }

  const handlePropertyChange = (propertyName: string, propertyType: any) => {
    dispatch(mainPageReducerUpdateExifFilter({
      id: filter.id,
      updates: {
        propertyName,
        propertyType,
        condition: {}, // Reset condition when property changes
      },
    }))
  }

  const handleConditionChange = (condition: ExifFilterCondition) => {
    dispatch(mainPageReducerUpdateExifFilter({
      id: filter.id,
      updates: {
        condition,
      },
    }))
  }

  const excludedPropertyNames = React.useMemo(
    () => usedPropertyNames.filter(name => name !== filter.propertyName),
    [usedPropertyNames, filter.propertyName]
  )

  return (
    <div className={styles.filterItem}>
      <div className={styles.header}>
        <Switch
          size="small"
          checked={!filter.isDisabled}
          onChange={checked => handleDisabledChange(!checked)}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleRemoveFilter}
          className={styles.deleteButton}
          size="small"
        />
      </div>
      <div className={styles.selectors}>
        <div className={styles.propertySelector}>
          <ExifPropertySelector
            value={filter.propertyName}
            onChange={handlePropertyChange}
            excludedProperties={excludedPropertyNames}
          />
        </div>
        
        {filter.propertyName && (
          <div className={styles.valueCondition}>
            <ExifValueCondition
              filter={filter}
              onChange={handleConditionChange}
            />
          </div>
        )}
      </div>
    </div>
  )
} 