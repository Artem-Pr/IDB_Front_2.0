import React from 'react'
import { Checkbox, Input } from 'antd'

import { useDispatch, useSelector } from 'react-redux'

import styles from './SettingsPage.module.scss'
import { settings } from '../../../redux/selectors'
import {
  setIsFullSizePreview,
  setMaxImagePreviewSlideLimit,
  setMinImagePreviewSlideLimit,
} from '../../../redux/reducers/settingsSlice-reducer'

export const SettingsPage = () => {
  const dispatch = useDispatch()
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

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>
          <Checkbox checked={isFullSizePreview} onChange={handleToggleIsFullSizePreview}>
            Full size preview
          </Checkbox>
        </li>
        <li>
          <div className="d-flex align-items-center">
            <Input
              className={styles.inputField}
              value={imagePreviewSlideLimits.min}
              onChange={handleSetMinImageSlideLimit}
              placeholder="min limit"
            />
            <span className={styles.inputFieldLabel}>Min image slide limit</span>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center">
            <Input
              className={styles.inputField}
              value={imagePreviewSlideLimits.max}
              onChange={handleSetMaxImageSlideLimit}
              placeholder="max limit"
            />
            <span className={styles.inputFieldLabel}>Max image slide limit</span>
          </div>
        </li>
      </ul>
    </div>
  )
}
