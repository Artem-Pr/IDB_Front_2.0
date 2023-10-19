import React from 'react'
import { Button } from 'antd'

import { useSelector } from 'react-redux'

import { uploadFiles } from '../../../../../redux/reducers/uploadSlice/thunks'
import { MainMenuKeys } from '../../../../../redux/types'
import { useAppDispatch } from '../../../../../redux/store/store'
import { useClearFilesArray, useFilesList, useUpdateOpenMenus } from '../../../../common/hooks/hooks'
import { curFolderInfo } from '../../../../../redux/selectors'

export const ButtonsMenu = () => {
  const dispatch = useAppDispatch()
  const { filesArr } = useFilesList()
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { setOpenMenus } = useUpdateOpenMenus()
  const { clearFilesArr } = useClearFilesArray()

  const handleUploadClick = () => {
    dispatch(uploadFiles(filesArr, currentFolderPath))
    clearFilesArr()
    setOpenMenus([MainMenuKeys.FOLDERS])
  }

  return (
    <div className="d-flex justify-content-around">
      <Button disabled={!filesArr.length} type="primary" onClick={clearFilesArr} danger>
        Delete all files
      </Button>
      <Button disabled={!currentFolderPath || !filesArr.length} type="primary" onClick={handleUploadClick}>
        Upload files
      </Button>
    </div>
  )
}
