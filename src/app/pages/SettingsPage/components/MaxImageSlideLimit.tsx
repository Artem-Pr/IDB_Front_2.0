import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Input } from 'antd'

import { settingsReducerSetMaxPreviewSlideLimit } from 'src/redux/reducers/settingsSlice'
import { getSettingsReducerImagePreviewSlideLimits } from 'src/redux/reducers/settingsSlice/selectors'

export const MaxImageSlideLimit = memo(() => {
  const dispatch = useDispatch()
  const imagePreviewSlideLimits = useSelector(getSettingsReducerImagePreviewSlideLimits)

  const handleSetMaxImageSlideLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(settingsReducerSetMaxPreviewSlideLimit(Number(e.target.value)))
  }

  return <Input value={imagePreviewSlideLimits.max} onChange={handleSetMaxImageSlideLimit} placeholder="max limit" />
})
