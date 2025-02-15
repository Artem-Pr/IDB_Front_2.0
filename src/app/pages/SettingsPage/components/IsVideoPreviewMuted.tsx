import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { setIsVideoPreviewMuted } from 'src/redux/reducers/settingsSlice/settingsSlice'
import { settings } from 'src/redux/selectors'

export const IsVideoPreviewMuted = memo(() => {
  const dispatch = useDispatch()
  const { isVideoPreviewMuted } = useSelector(settings)

  const handleSetIsVideoPreviewMuted = (e: CheckboxChangeEvent) => {
    dispatch(setIsVideoPreviewMuted(e.target.checked))
  }

  return (
    <Checkbox
      checked={isVideoPreviewMuted}
      defaultChecked={isVideoPreviewMuted}
      onChange={handleSetIsVideoPreviewMuted}
    />
  )
})
