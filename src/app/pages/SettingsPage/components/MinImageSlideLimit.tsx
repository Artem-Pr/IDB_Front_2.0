import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Input } from 'antd'

import { setMinImagePreviewSlideLimit } from 'src/redux/reducers/settingsSlice/settingsSlice'
import { settings } from 'src/redux/selectors'

export const MinImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const { imagePreviewSlideLimits } = useSelector(settings)

  const handleSetMinImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMinImagePreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.min} onChange={handleSetMinImageSlideLimit} placeholder="min limit" />
})
