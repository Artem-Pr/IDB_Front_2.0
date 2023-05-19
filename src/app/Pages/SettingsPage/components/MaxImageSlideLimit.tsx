import React, { memo } from 'react'
import { Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { settings } from '../../../../redux/selectors'
import { setMaxImagePreviewSlideLimit } from '../../../../redux/reducers/settingsSlice-reducer'

export const MaxImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const { imagePreviewSlideLimits } = useSelector(settings)

  const handleSetMaxImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMaxImagePreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.max} onChange={handleSetMaxImageSlideLimit} placeholder="max limit" />
})
