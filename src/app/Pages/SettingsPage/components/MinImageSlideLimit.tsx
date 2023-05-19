import React, { memo } from 'react'
import { Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { settings } from '../../../../redux/selectors'
import { setMinImagePreviewSlideLimit } from '../../../../redux/reducers/settingsSlice-reducer'

export const MinImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const { imagePreviewSlideLimits } = useSelector(settings)

  const handleSetMinImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMinImagePreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.min} onChange={handleSetMinImageSlideLimit} placeholder="min limit" />
})
