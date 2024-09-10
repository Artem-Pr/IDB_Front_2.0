import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Button, Checkbox, Tooltip } from 'antd'
import type { CheckboxProps } from 'antd'

import { useClearFilesArray, useFilesList, useUpdateOpenMenus } from 'src/app/common/hooks'
import { capitalize } from 'src/app/common/utils'
import { uploadFiles } from 'src/redux/reducers/uploadSlice/thunks'
import { setCheckForDuplicatesOnlyInCurrentFolder } from 'src/redux/reducers/uploadSlice/uploadSlice'
import {
  checkForDuplicatesOnlyInCurrentFolder,
  curFolderInfo,
  duplicateFilesArr,
  hasFailedUploadingFiles,
} from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import { MainMenuKeys } from 'src/redux/types'

const tooltipMessages = {
  addUploadingFolder: 'add a folder for uploading files',
  nothingToUpload: 'add files to upload',
  removeDuplicates: 'remove all duplicates before uploading',
  removeFiledFiles: 'remove failed files',
} as const

const getTooltipMessage = (messagesObj: Record<keyof typeof tooltipMessages, boolean>): string | false => capitalize(Object
  .keys(tooltipMessages)
  .filter(key => messagesObj[key])
  .map(key => tooltipMessages[key])
  .join(', ')) || false

export const ButtonsMenu = () => {
  const dispatch = useAppDispatch()
  const { filesArr } = useFilesList()
  const hasFailedFiles = useSelector(hasFailedUploadingFiles)
  const { currentFolderPath } = useSelector(curFolderInfo)
  const watchForDuplicatesOnlyInCurrentFolder = useSelector(checkForDuplicatesOnlyInCurrentFolder)
  const duplicates = useSelector(duplicateFilesArr)
  const { setOpenMenus } = useUpdateOpenMenus()
  const { clearFilesArr } = useClearFilesArray()

  const tooltipMessage = useMemo(() => getTooltipMessage({
    removeDuplicates: Boolean(duplicates.length),
    nothingToUpload: !filesArr.length,
    addUploadingFolder: !currentFolderPath,
    removeFiledFiles: hasFailedFiles,
  }), [duplicates.length, filesArr.length, currentFolderPath, hasFailedFiles])

  const showCheckForDuplicatesCheckbox = Boolean(duplicates.length) || watchForDuplicatesOnlyInCurrentFolder

  const handleUploadClick = () => {
    dispatch(uploadFiles())
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
        <Tooltip title={tooltipMessage}>
          <Button disabled={Boolean(tooltipMessage)} type="primary" onClick={handleUploadClick}>
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
