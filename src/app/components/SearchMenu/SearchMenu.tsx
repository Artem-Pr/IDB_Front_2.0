import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
  Button, Select, DatePicker, Input, Checkbox, Rate,
} from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { RangePickerProps } from 'antd/es/date-picker'
import cn from 'classnames'
import dayjs from 'dayjs'
import { difference, keys } from 'ramda'

import { DATE_TIME_FORMAT } from 'src/constants/dateConstants'
import {
  resetSearchMenu,
  setDateRange,
  setDescriptionFilter,
  setExcludeTags,
  setIncludeAllSearchTags,
  setIsAnyDescriptionFilter,
  setMimeTypes,
  setRatingFilter,
  setSearchFileName,
  setSearchTags,
} from 'src/redux/reducers/mainPageSlice/mainPageSlice'
import { fetchPhotos } from 'src/redux/reducers/mainPageSlice/thunks'
import { folderElement, main, searchMenu } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import { getISOStringWithUTC } from '../../common/utils/date'

import styles from './index.module.scss'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input
const fileTypes = keys(MimeTypes)

export const SearchMenu = () => {
  const dispatch = useAppDispatch()
  const { keywordsList } = useSelector(folderElement)
  const {
    searchTags,
    excludeTags,
    mimetypes,
    dateRange,
    fileName,
    includeAllSearchTags,
    rating,
    anyDescription,
    description,
  } = useSelector(searchMenu)
  const { isGalleryLoading } = useSelector(main)
  const searchKeywordsList = useMemo(() => difference(keywordsList, excludeTags), [excludeTags, keywordsList])
  const excludeKeywordsList = useMemo(() => difference(keywordsList, searchTags), [searchTags, keywordsList])
  const dayJsRange: RangePickerProps['value'] = useMemo(
    () => dateRange && [dayjs(dateRange[0]), dayjs(dateRange[1])],
    [dateRange],
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

  const handleRangePickerChange = (dayJsRangeValue: RangePickerProps['value']) => {
    const dateRangeValue: [string, string] | null = dayJsRangeValue
      ? [getISOStringWithUTC(dayJsRangeValue[0]), getISOStringWithUTC(dayJsRangeValue[1])]
      : null
    dispatch(setDateRange(dateRangeValue))
  }

  const handleSearchingFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFileName(event.target.value.trim()))
  }

  const handleIncludeAllTagsChange = (e: CheckboxChangeEvent) => {
    dispatch(setIncludeAllSearchTags(e.target.checked))
  }

  const handleRatingChange = (value: number) => {
    dispatch(setRatingFilter(value))
  }

  const handleAnyDescriptionSwitch = (e: CheckboxChangeEvent) => {
    dispatch(setIsAnyDescriptionFilter(e.target.checked))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setDescriptionFilter(e.target.value.trim()))
  }

  return (
    <div className={styles.wrapper}>
      <div className="d-flex gap-10 align-items-center margin-bottom-10">
        <span>Rating:</span>
        <Rate value={rating} onChange={handleRatingChange} />
      </div>

      <span className={styles.title}>File name:</span>
      <Input
        className="margin-bottom-10"
        placeholder="write to search"
        value={fileName}
        onChange={handleSearchingFileNameChange}
      />

      <div className={cn(styles.title, 'd-flex justify-content-between align-items-center')}>
        <span>Search tags:</span>
        <Checkbox className="margin-left-auto" checked={includeAllSearchTags} onChange={handleIncludeAllTagsChange}>
          Include all tags
        </Checkbox>
      </div>
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
      <RangePicker className="w-100" format={DATE_TIME_FORMAT} value={dayJsRange} onChange={handleRangePickerChange} />

      <div className={cn(styles.title, 'd-flex justify-content-between align-items-center margin-top-10')}>
        <span>Description:</span>
        <Checkbox className="margin-left-auto" checked={anyDescription} onChange={handleAnyDescriptionSwitch}>
          Any description
        </Checkbox>
      </div>
      <TextArea
        style={{ resize: 'vertical' }}
        placeholder="write the description"
        value={description}
        onChange={handleDescriptionChange}
        maxLength={2000}
        disabled={anyDescription}
      />

      <div className="d-flex justify-content-end gap-10 margin-top-10">
        <Button onClick={handleResetFilters}>Reset</Button>

        <Button type="primary" loading={isGalleryLoading} onClick={handleFetchGallery}>
          Search
        </Button>
      </div>
    </div>
  )
}
