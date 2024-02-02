import React from 'react'
import { useSelector } from 'react-redux'

import { Button, Checkbox, Tooltip } from 'antd'
import type { CheckboxProps } from 'antd'

import { uploadFiles } from '../../../../../redux/reducers/uploadSlice/thunks'
import { setCheckForDuplicatesOnlyInCurrentFolder } from '../../../../../redux/reducers/uploadSlice/uploadSlice'
import { checkForDuplicatesOnlyInCurrentFolder, curFolderInfo, duplicateFilesArr } from '../../../../../redux/selectors'
import { useAppDispatch } from '../../../../../redux/store/store'
import { MainMenuKeys } from '../../../../../redux/types'
import { useClearFilesArray, useFilesList, useUpdateOpenMenus } from '../../../../common/hooks/hooks'

export const ButtonsMenu = () => {
  const dispatch = useAppDispatch()
  const { filesArr } = useFilesList()
  const { currentFolderPath } = useSelector(curFolderInfo)
  const watchForDuplicatesOnlyInCurrentFolder = useSelector(checkForDuplicatesOnlyInCurrentFolder)
  const duplicates = useSelector(duplicateFilesArr)
  const { setOpenMenus } = useUpdateOpenMenus()
  const { clearFilesArr } = useClearFilesArray()

  const disableUploadButton = !filesArr.length || !currentFolderPath || Boolean(duplicates.length)
  const showCheckForDuplicatesCheckbox = Boolean(duplicates.length) || watchForDuplicatesOnlyInCurrentFolder

  const handleUploadClick = () => {
    dispatch(uploadFiles(filesArr, currentFolderPath))
    clearFilesArr()
    setOpenMenus([MainMenuKeys.FOLDERS])
  }

  const handleChangeWatchingDuplicates: CheckboxProps['onChange'] = event => {
    dispatch(setCheckForDuplicatesOnlyInCurrentFolder(event.target.checked))
  }

  return (
    <div style={{ minWidth: '300px' }}>
      <div className="d-flex justify-content-around margin-bottom-10">
        <Button disabled={!filesArr.length} type="primary" onClick={clearFilesArr} danger>
          Delete all files
        </Button>
        <Tooltip title={duplicates.length ? 'Please remove all duplicates before uploading' : ''}>
          <Button disabled={disableUploadButton} type="primary" onClick={handleUploadClick}>
            Upload files
          </Button>
        </Tooltip>
      </div>
      {showCheckForDuplicatesCheckbox && (
        <Checkbox
          className="margin-left-10"
          checked={watchForDuplicatesOnlyInCurrentFolder}
          onChange={handleChangeWatchingDuplicates}
        >
          Check for duplicates only in the current folder
        </Checkbox>
      )}
    </div>
  )
}
