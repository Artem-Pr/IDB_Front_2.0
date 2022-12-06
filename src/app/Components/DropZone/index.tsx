import React, { useMemo } from 'react'

import { Upload, message, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import { compose } from 'ramda'

import type { RcFile, UploadChangeParam } from 'antd/es/upload'

import styles from './index.module.scss'
import { curFolderInfo, uploadingBlobs } from '../../../redux/selectors'
import { fetchPhotosPreview, setBlob, setUploadingStatus } from '../../../redux/reducers/uploadSlice-reducer'
import { MainMenuKeys } from '../../../redux/types'
import { errorMessage } from '../../common/notifications'

const { Dragger } = Upload

const isFile = (file: string | Blob | RcFile): file is RcFile => Boolean((file as RcFile)?.name)

const getDispatchObjFromBlob = (file: RcFile) => ({
  name: file.name,
  originalPath: URL.createObjectURL(file),
})

const isFileNameAlreadyExist = (file: RcFile, uploadingFilesList: Record<string, string>) => {
  return Object.keys(uploadingFilesList).includes(file.name)
}

interface Props {
  openMenus: string[]
}

const DropZone = ({ openMenus }: Props) => {
  const { currentFolderPath } = useSelector(curFolderInfo)
  const uploadingFiles = useSelector(uploadingBlobs)
  const dispatch = useDispatch()
  const isEditOne = useMemo(() => openMenus.includes(MainMenuKeys.EDIT), [openMenus])
  const isEditMany = useMemo(() => openMenus.includes(MainMenuKeys.EDIT_BULK), [openMenus])

  const props: UploadProps = {
    accept: 'image/*, video/*',
    className: cn(styles.dropZone, { active: isEditOne || isEditMany }),
    name: 'file',
    multiple: true,
    showUploadList: false,
    headers: {
      path: currentFolderPath,
      'Content-Type': 'application/json',
    },
    customRequest({ file }) {
      const uploadFile = () => {
        isFile(file) && compose(dispatch, setBlob, getDispatchObjFromBlob)(file)
        dispatch(fetchPhotosPreview(file))
        dispatch(setUploadingStatus('empty'))
      }
      const fileAlreadyExist = isFile(file) && isFileNameAlreadyExist(file, uploadingFiles)

      fileAlreadyExist ? errorMessage(new Error(`${file.name} is already exist`), 'File is not uploaded') : uploadFile()
    },
    onChange(info: UploadChangeParam) {
      const { status } = info.file
      status !== 'uploading' && console.log(info.file, info.fileList)
      status === 'done' && message.success(`${info.file.name} file uploaded successfully.`)
      status === 'error' && message.error(`${info.file.name} file upload failed.`)
    },
  }

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Dragger>
  )
}

export default DropZone
