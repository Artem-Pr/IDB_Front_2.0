import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { ExifValueType } from 'src/common/constants'
import { mainPageReducerAddExifFilter } from 'src/redux/reducers/mainPageSlice'
import { getMainPageReducerSearchMenu } from 'src/redux/reducers/mainPageSlice/selectors'
import type { ExifFilter } from 'src/redux/reducers/mainPageSlice/types'
import { useAppDispatch } from 'src/redux/store/store'

import { ExifFilterItem } from './components/ExifFilterItem/ExifFilterItem'

import styles from './ExifFilters.module.scss'

export const ExifFiltersContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const { exifFilters } = useSelector(getMainPageReducerSearchMenu)

  const handleAddExifFilter = () => {
    const newFilter: ExifFilter = {
      id: `exif_filter_${Date.now()}_${Math.random()}`,
      propertyName: '',
      propertyType: ExifValueType.STRING,
      condition: {},
    }
    dispatch(mainPageReducerAddExifFilter(newFilter))
  }

  const usedPropertyNames = useMemo(() => 
    exifFilters.map(filter => filter.propertyName)
      .filter(Boolean), 
  [exifFilters]
  )

  return (
    <div className={styles.container}>
      {exifFilters.map(filter => (
        <ExifFilterItem
          key={filter.id}
          filter={filter}
          usedPropertyNames={usedPropertyNames}
        />
      ))}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddExifFilter}
        className={styles.addButton}
      >
        Add EXIF filter
      </Button>
    </div>
  )
} 