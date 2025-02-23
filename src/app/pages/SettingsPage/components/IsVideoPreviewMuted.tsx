import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { settingsReducerSetIsVideoPreviewMuted } from 'src/redux/reducers/settingsSlice'
import { getSettingsReducerIsVideoPreviewMuted } from 'src/redux/reducers/settingsSlice/selectors'

export const IsVideoPreviewMuted = memo(() => {
  const dispatch = useDispatch()
  const isVideoPreviewMuted = useSelector(getSettingsReducerIsVideoPreviewMuted)

  const handleSetIsVideoPreviewMuted = (e: CheckboxChangeEvent) => {
    dispatch(settingsReducerSetIsVideoPreviewMuted(e.target.checked))
  }

  return (
    <Checkbox
      checked={isVideoPreviewMuted}
      defaultChecked={isVideoPreviewMuted}
      onChange={handleSetIsVideoPreviewMuted}
    />
  )
})
