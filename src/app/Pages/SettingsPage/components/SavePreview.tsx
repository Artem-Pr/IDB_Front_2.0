import React, { memo } from 'react'
import { Checkbox } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { settings } from '../../../../redux/selectors'
import { setSavePreview } from '../../../../redux/reducers/settingsSlice-reducer'

export const SavePreview = memo(() => {
  const dispatch = useDispatch()
  const { savePreview } = useSelector(settings)

  const handleSavePreview = () => {
    dispatch(setSavePreview(!savePreview))
  }

  return <Checkbox checked={savePreview} onChange={handleSavePreview} />
})
