import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Select, DatePicker } from 'antd'
import { difference, keys } from 'ramda'
import cn from 'classnames'

import type { RangePickerProps } from 'antd/es/date-picker'

import dayjs from 'dayjs'

import { folderElement, main, searchMenu } from '../../../redux/selectors'
import styles from './index.module.scss'
import {
  resetSearchMenu,
  setDateRange,
  setExcludeTags,
  setMimeTypes,
  setSearchTags,
} from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { MimeTypes } from '../../../redux/types/MimeTypes'
import { fetchPhotos } from '../../../redux/reducers/mainPageSlice/thunks'
import { dateFormat } from '../../common/utils/date'

const { Option } = Select
const { RangePicker } = DatePicker
const fileTypes = keys(MimeTypes)

export const SearchMenu = () => {
  const dispatch = useDispatch()
  const { keywordsList } = useSelector(folderElement)
  const { searchTags, excludeTags, mimetypes, dateRange } = useSelector(searchMenu)
  const { isGalleryLoading } = useSelector(main)
  const searchKeywordsList = useMemo(() => difference(keywordsList, excludeTags), [excludeTags, keywordsList])
  const excludeKeywordsList = useMemo(() => difference(keywordsList, searchTags), [searchTags, keywordsList])
  const dayJsRange: RangePickerProps['value'] = useMemo(
    () => dateRange && [dayjs(dateRange[0]), dayjs(dateRange[1])],
    [dateRange]
  )

  const handleSearchChange = (value: string[]) => {
    dispatch(setSearchTags(value))
  }

  const handleExcludeChange = (value: string[]) => {
    dispatch(setExcludeTags(value))
  }

  const handleFileTypesChange = (value: MimeTypes[]) => {
    dispatch(setMimeTypes(value))
  }

  const handleFetchGallery = () => {
    dispatch(fetchPhotos())
  }

  const handleResetFilters = () => {
    dispatch(resetSearchMenu())
  }

  const handleRangePickerChange = (dayJsRange: RangePickerProps['value']) => {
    const dateRange: [string, string] | null = dayJsRange
      ? [dayjs(dayJsRange[0])?.format(), dayjs(dayJsRange[1])?.format()]
      : null
    dispatch(setDateRange(dateRange))
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Search tags:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select Keywords"
        onChange={handleSearchChange}
        value={searchTags}
      >
        {searchKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>

      <span className={styles.title}>Exclude tags:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select Keywords"
        onChange={handleExcludeChange}
        value={excludeTags}
      >
        {excludeKeywordsList.map(keyword => (
          <Option key={keyword} value={keyword}>
            {keyword}
          </Option>
        ))}
      </Select>

      <span className={styles.title}>Files type:</span>
      <Select
        className={cn(styles.select, 'w-100')}
        mode="tags"
        placeholder="select files type"
        onChange={handleFileTypesChange}
        value={mimetypes}
      >
        {fileTypes.map(type => (
          <Option key={type} value={MimeTypes[type]}>
            {type}
          </Option>
        ))}
      </Select>

      <span className={styles.title}>Date range:</span>
      <RangePicker className="w-100" format={dateFormat} value={dayJsRange} onChange={handleRangePickerChange} />

      <div className="d-flex justify-content-end gap-10 margin-top-10">
        <Button onClick={handleResetFilters}>Reset</Button>

        <Button type="primary" loading={isGalleryLoading} onClick={handleFetchGallery}>
          Search
        </Button>
      </div>
    </div>
  )
}
