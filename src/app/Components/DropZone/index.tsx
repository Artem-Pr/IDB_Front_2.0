import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  message, Progress, Upload, UploadProps,
} from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import cn from 'classnames'
import { compose } from 'ramda'

import { setIsLoading } from '../../../redux/reducers/sessionSlice/sessionSlice'
import { increaseCountOfPreviewLoading, setBlob, setUploadingStatus } from '../../../redux/reducers/uploadSlice'
import { addUploadingFile, fetchPhotosPreview } from '../../../redux/reducers/uploadSlice/thunks'
import { curFolderInfo, upload } from '../../../redux/selectors'
import { useAppDispatch } from '../../../redux/store/store'
import { MainMenuKeys } from '../../../redux/types'
import { MimeTypes } from '../../../redux/types/MimeTypes'
import { errorMessage } from '../../common/notifications'
import { isMimeType } from '../../common/utils'

import { getDispatchObjFromBlob, isFile, isFileNameAlreadyExist } from './heplers'
import { getEmptyUploadObject } from './heplers/getEmptyUploadObject'

import styles from './index.module.scss'

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
      dispatch(setIsLoading(true))
      const uploadFile = async () => {
        const dispatchNewFile = async () => {
          uploading.isProcessing = true
          dispatch(increaseCountOfPreviewLoading())
          isFile(file) && compose(dispatch, setBlob, getDispatchObjFromBlob)(file)
          dispatch<any>(fetchPhotosPreview(file))
            .then(() => {
              uploading.isProcessing = false
              setFinishedNumberOfFiles(prevState => prevState + 1)
            })
          dispatch(setUploadingStatus('empty'))
        }

        uploading.isProcessing ? setTimeout(uploadFile, 100) : await dispatchNewFile()
      }

      const handleError = (notificationMessage: string) => {
        const uploadingError = new Error(`${isFile(file) ? file.name : '?'} ${notificationMessage}`)
        errorMessage(uploadingError, 'File is not uploaded')
        uploading.isProcessing = false
        setFinishedNumberOfFiles(prevState => prevState + 1)
      }
      // eslint-disable-next-line no-plusplus
      ++uploading.totalFiles
      const fileAlreadyExist = isFile(file) && isFileNameAlreadyExist(file, uploadingBlobs)
      const isMimeTypeExist = isFile(file) && isMimeType(file.type)

      fileAlreadyExist && handleError('is already exist')
      !isMimeTypeExist && handleError('file type not supported')
      !fileAlreadyExist && isMimeTypeExist && setTimeout(uploadFile)
      !fileAlreadyExist
        && isMimeTypeExist
        && dispatch(addUploadingFile(getEmptyUploadObject({ type: file.type, name: file.name })))
    },
    onChange(info: UploadChangeParam) {
      const { status } = info.file
      status !== 'uploading' && console.info(info.file, info.fileList)
      status === 'done' && message.success(`${info.file.name} file uploaded successfully.`)
      status === 'error' && message.error(`${info.file.name} file upload failed.`)
    },
  }

  const progress = useMemo(
    () => Math.round((finishedNumberOfFiles / uploading.totalFiles) * 100) || false,
    [finishedNumberOfFiles],
  )

  useEffect(() => {
    const refreshLoading = () => {
      setFinishedNumberOfFiles(0)
      uploading.totalFiles = 0
    };
    (progress === 100 || progress === Infinity) && refreshLoading()
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
