import React, { useEffect, useMemo, useState } from 'react'

import { message, Progress, Upload, UploadProps } from 'antd'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { compose } from 'ramda'

import type { UploadChangeParam } from 'antd/es/upload'

import styles from './index.module.scss'
import { curFolderInfo, upload } from '../../../redux/selectors'
import {
  fetchPhotosPreview,
  increaseCountOfPreviewLoading,
  setBlob,
  setUploadingStatus,
} from '../../../redux/reducers/uploadSlice-reducer'
import { MainMenuKeys } from '../../../redux/types'
import { errorMessage } from '../../common/notifications'
import { MimeTypes } from '../../../redux/types/MimeTypes'
import { getDispatchObjFromBlob, heicToJpegFile, isFile, isFileNameAlreadyExist } from './heplers'
import { useAppDispatch } from '../../../redux/store/store'

const { Dragger } = Upload
const uploading = {
  isProcessing: false,
  totalFiles: 0,
}

interface Props {
  openMenus: string[]
}

const DropZone = ({ openMenus }: Props) => {
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { previewLoadingCount, uploadingBlobs } = useSelector(upload)
  const [finishedNumberOfFiles, setFinishedNumberOfFiles] = useState<number>(0)
  const dispatch = useAppDispatch()
  const isEditOne = useMemo(() => openMenus.includes(MainMenuKeys.EDIT), [openMenus])
  const isEditMany = useMemo(() => openMenus.includes(MainMenuKeys.EDIT_BULK), [openMenus])

  const props: UploadProps = {
    accept: `${MimeTypes.heic}, image/*, video/*`,
    className: cn(styles.dropZone, { active: isEditOne || isEditMany }),
    name: 'file',
    multiple: true,
    showUploadList: false,
    headers: {
      path: currentFolderPath,
      'Content-Type': 'application/json',
    },
    async customRequest({ file }) {
      const uploadFile = async () => {
        const dispatchNewFile = async () => {
          // eslint-disable-next-line functional/immutable-data
          uploading.isProcessing = true
          dispatch(increaseCountOfPreviewLoading())
          const fileFromHeic = isFile(file) && file.type === MimeTypes.heic && (await heicToJpegFile(file))
          const uploadedFile = fileFromHeic || file
          isFile(uploadedFile) && compose(dispatch, setBlob, getDispatchObjFromBlob)(uploadedFile)
          dispatch<any>(fetchPhotosPreview(uploadedFile)).then(() => {
            // eslint-disable-next-line functional/immutable-data
            uploading.isProcessing = false
            setFinishedNumberOfFiles(prevState => prevState + 1)
          })
          dispatch(setUploadingStatus('empty'))
        }

        uploading.isProcessing ? setTimeout(() => uploadFile(), 100) : await dispatchNewFile()
      }
      // eslint-disable-next-line functional/immutable-data
      ++uploading.totalFiles
      const fileAlreadyExist = isFile(file) && isFileNameAlreadyExist(file, uploadingBlobs)
      fileAlreadyExist
        ? errorMessage(new Error(`${isFile(file) ? file.name : '?'} is already exist`), 'File is not uploaded')
        : setTimeout(() => uploadFile())
    },
    onChange(info: UploadChangeParam) {
      const { status } = info.file
      status !== 'uploading' && console.log(info.file, info.fileList)
      status === 'done' && message.success(`${info.file.name} file uploaded successfully.`)
      status === 'error' && message.error(`${info.file.name} file upload failed.`)
    },
  }

  const progress = useMemo(
    () => Math.round((finishedNumberOfFiles / uploading.totalFiles) * 100) || false,
    [finishedNumberOfFiles]
  )

  useEffect(() => {
    const refreshLoading = () => {
      setFinishedNumberOfFiles(0)
      // eslint-disable-next-line functional/immutable-data
      uploading.totalFiles = 0
    }
    progress === 100 && refreshLoading()
  }, [progress])

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        {finishedNumberOfFiles || previewLoadingCount ? <LoadingOutlined /> : <InboxOutlined />}
      </p>
      {progress && <Progress percent={progress} style={{ maxWidth: 200 }} />}
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Dragger>
  )
}

export default DropZone
