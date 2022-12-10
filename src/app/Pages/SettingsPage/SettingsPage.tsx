import React, { useState } from 'react'
import { Button, Checkbox, Input, Modal, Select, Tag } from 'antd'

import { useDispatch, useSelector } from 'react-redux'

import { sort } from 'ramda'

import cn from 'classnames'

import styles from './SettingsPage.module.scss'
import { pagination, settings } from '../../../redux/selectors'
import {
  deleteUnusedKeyword,
  fetchUnusedKeywordsList,
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../../../redux/reducers/settingsSlice-reducer'
import { setGalleryPagination } from '../../../redux/reducers/mainPageSlice/mainPageSlice'
import { deleteConfirmation } from '../../../assets/config/moduleConfig'

const pageSizeOptions = [
  5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300,
].map(item => ({ label: item, value: item }))

const getFilteredOptions = (values: number[]) => ({ pageSizeOptions: sort((a, b) => a - b, values) })

export const SettingsPage = () => {
  const dispatch = useDispatch<any>()
  const [modal, contextHolder] = Modal.useModal()
  const { pageSizeOptions: pageSizeSelectedOptions } = useSelector(pagination)
  const { isFullSizePreview, imagePreviewSlideLimits, unusedKeywords } = useSelector(settings)
  const [isUnusedKeywordsLoaded, setIsUnusedKeywordsLoaded] = useState(false)
  const [unusedKeywordsLoading, setUnusedKeywordsLoading] = useState(false)

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

  const handleUpdateUnusedKeywordsList = async () => {
    setUnusedKeywordsLoading(true)
    dispatch(fetchUnusedKeywordsList()).then(() => {
      setUnusedKeywordsLoading(false)
      setIsUnusedKeywordsLoaded(true)
    })
  }

  const handleRemoveUnusedKeyword = (keyword: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const onOk = () => {
      dispatch(deleteUnusedKeyword(keyword))
    }
    modal.confirm(deleteConfirmation({ onOk, type: 'keyword' }))
  }

  const allKeywordsAreUsed = Boolean(!unusedKeywordsLoading && isUnusedKeywordsLoaded && !unusedKeywords.length)
  const showUnusedKeywordsList = Boolean(!unusedKeywordsLoading && isUnusedKeywordsLoaded && unusedKeywords.length)

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

        <span>Unused keywords</span>
        {allKeywordsAreUsed && <span>All keywords are used</span>}
        {!isUnusedKeywordsLoaded && (
          <Button
            className={styles.inputField}
            type="link"
            onClick={handleUpdateUnusedKeywordsList}
            loading={unusedKeywordsLoading}
          >
            Click to update
          </Button>
        )}
        <div>
          {showUnusedKeywordsList && (
            <div>
              {unusedKeywords.map(keyword => (
                <Tag style={{ width: 'auto' }} key={keyword} onClose={handleRemoveUnusedKeyword(keyword)} closable>
                  {keyword}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>
      {contextHolder}
    </div>
  )
}
