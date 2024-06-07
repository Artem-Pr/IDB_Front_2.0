import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'

import { setIsFullSizePreview } from 'src/redux/reducers/settingsSlice/settingsSlice'
import { settings } from 'src/redux/selectors'

export const FullSizePreview = memo(() => {
  const dispatch = useDispatch()
  const { isFullSizePreview } = useSelector(settings)

  const handleToggleIsFullSizePreview = () => {
    dispatch(setIsFullSizePreview(!isFullSizePreview))
  }

  return <Checkbox checked={isFullSizePreview} onChange={handleToggleIsFullSizePreview} />
})
