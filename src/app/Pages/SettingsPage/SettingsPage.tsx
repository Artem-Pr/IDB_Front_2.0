import React from 'react'
import { Checkbox, Input, Select } from 'antd'

import { useDispatch, useSelector } from 'react-redux'

import { sort } from 'ramda'

import cn from 'classnames'

import styles from './SettingsPage.module.scss'
import { pagination, settings } from '../../../redux/selectors'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../../../redux/reducers/settingsSlice-reducer'
import { setGalleryPagination } from '../../../redux/reducers/mainPageSlice/mainPageSlice'

const pageSizeOptions = [
  5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300,
].map(item => ({ label: item, value: item }))

const getFilteredOptions = (values: number[]) => ({ pageSizeOptions: sort((a, b) => a - b, values) })

export const SettingsPage = () => {
  const dispatch = useDispatch()
  const { pageSizeOptions: pageSizeSelectedOptions } = useSelector(pagination)
  const { isFullSizePreview, imagePreviewSlideLimits } = useSelector(settings)

  const handleToggleIsFullSizePreview = () => {
    dispatch(setIsFullSizePreview(!isFullSizePreview))
  }

  const handleSetMaxImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMaxImagePreviewSlideLimit(Number(e.target.value)))
  }

  const handleSetMinImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMinImagePreviewSlideLimit(Number(e.target.value)))
  }

  const handlePageSizeListChange = (values: number[]) => {
    values.length > 0 && dispatch(setGalleryPagination(getFilteredOptions(values)))
  }

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.gridWrapper, 'd-grid')}>
        <span className={styles.inputFieldLabel}>Full size preview</span>
        <Checkbox checked={isFullSizePreview} onChange={handleToggleIsFullSizePreview} />

        <span>Min image slide limit</span>
        <Input
          className={styles.inputField}
          value={imagePreviewSlideLimits.min}
          onChange={handleSetMinImageSlideLimit}
          placeholder="min limit"
        />

        <span>Max image slide limit</span>
        <Input
          className={styles.inputField}
          value={imagePreviewSlideLimits.max}
          onChange={handleSetMaxImageSlideLimit}
          placeholder="max limit"
        />

        <span>Pagination options</span>
        <Select
          mode="multiple"
          value={pageSizeSelectedOptions}
          defaultValue={pageSizeSelectedOptions}
          onChange={handlePageSizeListChange}
          options={pageSizeOptions}
        />
      </div>
    </div>
  )
}
