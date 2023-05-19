import React, { memo } from 'react'
import { Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { settings } from '../../../../redux/selectors'
import { setIsFullSizePreview } from '../../../../redux/reducers/settingsSlice-reducer'

export const FullSizePreview = memo(() => {
  const dispatch = useDispatch()
  const { isFullSizePreview } = useSelector(settings)

  const handleToggleIsFullSizePreview = () => {
    dispatch(setIsFullSizePreview(!isFullSizePreview))
  }

  return <Checkbox checked={isFullSizePreview} onChange={handleToggleIsFullSizePreview} />
})
