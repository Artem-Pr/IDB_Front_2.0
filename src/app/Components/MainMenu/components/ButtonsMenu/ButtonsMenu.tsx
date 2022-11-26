import React from 'react'
import { Button } from 'antd'

import { useDispatch } from 'react-redux'

import { uploadFiles } from '../../../../../redux/reducers/uploadSlice-reducer'
import { FieldsObj, MainMenuKeys } from '../../../../../redux/types'

interface Props {
  filesArr: FieldsObj[]
  currentFolderPath: string
  updateOpenMenus: (value: MainMenuKeys[]) => void
  removeFiles: () => void
}

export const ButtonsMenu = ({ filesArr, currentFolderPath, updateOpenMenus, removeFiles }: Props) => {
  const dispatch = useDispatch()

  const handleUploadClick = () => {
    dispatch(uploadFiles(filesArr, currentFolderPath))
    removeFiles()
    updateOpenMenus([MainMenuKeys.FOLDERS])
  }

  return (
    <div className="d-flex justify-content-around">
      <Button disabled={!filesArr.length} type="primary" onClick={removeFiles} danger>
        Delete all files
      </Button>
      <Button disabled={!currentFolderPath || !filesArr.length} type="primary" onClick={handleUploadClick}>
        Upload files
      </Button>
    </div>
  )
}
