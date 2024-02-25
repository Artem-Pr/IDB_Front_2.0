import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'

import { setSavePreview } from '../../../../redux/reducers/settingsSlice/settingsSlice'
import { settings } from '../../../../redux/selectors'

export const SavePreview = memo(() => {
  const dispatch = useDispatch()
  const { savePreview } = useSelector(settings)

  const handleSavePreview = () => {
    dispatch(setSavePreview(!savePreview))
  }

  return <Checkbox checked={savePreview} onChange={handleSavePreview} />
})
