import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Input } from 'antd'

import { settingsReducerSetMinPreviewSlideLimit } from 'src/redux/reducers/settingsSlice'
import { getSettingsReducerImagePreviewSlideLimits } from 'src/redux/reducers/settingsSlice/selectors'

export const MinImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const imagePreviewSlideLimits = useSelector(getSettingsReducerImagePreviewSlideLimits)

  const handleSetMinImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsReducerSetMinPreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.min} onChange={handleSetMinImageSlideLimit} placeholder="min limit" />
})
