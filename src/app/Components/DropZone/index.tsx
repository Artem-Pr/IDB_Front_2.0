import React from 'react'

import { Upload, message, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { useDispatch, useSelector } from 'react-redux'

import styles from './index.module.scss'
import { folderElement } from '../../../redux/selectors'
import { fetchPhotosPreview } from '../../../redux/reducers/uploadSlice-reducer'

const { Dragger } = Upload

const DropZone = () => {
  const { currentFolderPath } = useSelector(folderElement)
  const dispatch = useDispatch()

  const props: UploadProps = {
    accept: 'image/*, video/*',
    className: styles.dropZone,
    name: 'file',
    multiple: true,
    showUploadList: false,
    headers: {
      path: currentFolderPath,
      'Content-Type': 'application/json',
    },
    customRequest(info) {
      dispatch(fetchPhotosPreview(info.file))
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
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
      </p>
    </Dragger>
  )
}

export default DropZone
