import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

import { useUppyUploader } from 'src/app/components/UppyUploader/hooks/useUppyUploader'
import { settingsReducerSetIsNewUploader } from 'src/redux/reducers/settingsSlice'
import { getSettingsReducerIsNewUploader } from 'src/redux/reducers/settingsSlice/selectors'
import { uploadReducerSetShowUppyUploaderModal } from 'src/redux/reducers/uploadSlice'

export const IsNewUploader = memo(() => {
  const dispatch = useDispatch()
  const uppy = useUppyUploader()
  const isNewUploader = useSelector(getSettingsReducerIsNewUploader)

  const handleSetIsNewUploader = (e: CheckboxChangeEvent) => {
    dispatch(settingsReducerSetIsNewUploader(e.target.checked))
    if (e.target.checked) {
      uppy.init()
    } else {
      dispatch(uploadReducerSetShowUppyUploaderModal(false))
      uppy.uppyInstance.destroy()
    }
  }

  return (
    <Checkbox
      checked={isNewUploader}
      defaultChecked={isNewUploader}
      onChange={handleSetIsNewUploader}
    />
  )
})
