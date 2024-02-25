import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Input } from 'antd'

import { setMaxImagePreviewSlideLimit } from '../../../../redux/reducers/settingsSlice/settingsSlice'
import { settings } from '../../../../redux/selectors'

export const MaxImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const { imagePreviewSlideLimits } = useSelector(settings)

  const handleSetMaxImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMaxImagePreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.max} onChange={handleSetMaxImageSlideLimit} placeholder="max limit" />
})
