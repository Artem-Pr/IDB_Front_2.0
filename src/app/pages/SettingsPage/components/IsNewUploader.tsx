import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { settingsReducerSetIsNewUploader } from 'src/redux/reducers/settingsSlice'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'

export const IsNewUploader = memo(() => {
  const dispatch = useDispatch()
  const isNewUploader = useSelector(getSettingsReducerIsNewUploader)

  const handleSetIsNewUploader = (e: CheckboxChangeEvent) => {
    dispatch(settingsReducerSetIsNewUploader(e.target.checked))
  }

  return (
    <Checkbox
      checked={isNewUploader}
      defaultChecked={isNewUploader}
      onChange={handleSetIsNewUploader}
    />
  )
})
