import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  message, Progress, Upload, UploadProps,
} from 'antd'
import type { RcFile, UploadChangeParam } from 'antd/es/upload'
import cn from 'classnames'
import { compose } from 'ramda'

import type { Media } from 'src/api/models/media'
import { MediaInstance } from 'src/api/models/media'
import { errorMessage } from 'src/app/common/notifications'
import { wait, isMimeType } from 'src/app/common/utils'
import { setIsLoading } from 'src/redux/reducers/sessionSlice/sessionSlice'
import { increaseCountOfPreviewLoading, setBlob, setUploadingStatus } from 'src/redux/reducers/uploadSlice'
import { addUploadingFile, fetchPhotosPreview } from 'src/redux/reducers/uploadSlice/thunks'
import { curFolderInfo, upload } from 'src/redux/selectors'
import { useAppDispatch } from 'src/redux/store/store'
import { MainMenuKeys } from 'src/redux/types'
import { MimeTypes } from 'src/redux/types/MimeTypes'

import {
  getDispatchObjFromBlob, isFile, isFileNameAlreadyExist,
} from './heplers'

import styles from './index.module.scss'

const { Dragger } = Upload
const uploadingFile: ValidRcFile[] = []
const uploading = {
  data: uploadingFile,
  isProcessing: false,
  totalFiles: 0,
  isBeforeProcessing: true,
}

interface ValidRcFile extends RcFile {
  type: MimeTypes
}

interface Props {
  openMenus: string[]
}

const DropZone = ({ openMenus }: Props) => {
  const { currentFolderPath } = useSelector(curFolderInfo)
  const { previewLoadingCount, uploadingBlobs, uploadingFiles } = useSelector(upload)
  const [finishedNumberOfFiles, setFinishedNumberOfFiles] = useState<number>(0)
  const dispatch = useAppDispatch()
  const isEditOne = useMemo(() => openMenus.includes(MainMenuKeys.EDIT), [openMenus])
  const isEditMany = useMemo(() => openMenus.includes(MainMenuKeys.EDIT_BULK), [openMenus])

  const props: UploadProps = {
    accept: `${MimeTypes.heic}, image/*, video/*`,
    className: cn(styles.dropZone, { active: isEditOne || isEditMany }),
    name: 'file',
    fileList: [],
    multiple: true,
    showUploadList: false,
    headers: {
      path: currentFolderPath,
      'Content-Type': 'application/json',
    },
    async customRequest({ file }) {
      dispatch(setIsLoading(true))
      const uploadFile = async (fileFormQueue: RcFile) => {
        const dispatchNewFile = async () => {
          uploading.isProcessing = true
          dispatch(increaseCountOfPreviewLoading())
          isFile(fileFormQueue) && compose(dispatch, setBlob, getDispatchObjFromBlob)(fileFormQueue)
          dispatch<any>(fetchPhotosPreview(fileFormQueue))
            .then(() => {
              uploading.isProcessing = false
              setFinishedNumberOfFiles(prevState => prevState + 1)
            })
          dispatch(setUploadingStatus('empty'))
        }
        dispatchNewFile()
      }

      const handleError = (notificationMessage: string) => {
        const uploadingError = new Error(`${isFile(file) ? file.name : '?'} ${notificationMessage}`)
        errorMessage(uploadingError, 'File is not uploaded')
        uploading.isProcessing = false
      }

      const isValidFile = (fileFormQueue: string | Blob | RcFile): fileFormQueue is ValidRcFile => {
        const fileAlreadyExist = isFile(fileFormQueue) && isFileNameAlreadyExist(fileFormQueue, uploadingBlobs)
        const isMimeTypeExist = isFile(fileFormQueue) && isMimeType(fileFormQueue.type)

        fileAlreadyExist && handleError('is already exist')
        !isMimeTypeExist && handleError('file type not supported')

        return !fileAlreadyExist && isMimeTypeExist
      }

      const proceedUpload = async (counter: number = 0) => {
        const currentFile: ValidRcFile = uploading.data[counter]

        if (currentFile) {
          await wait()
          uploadFile(currentFile)
          proceedUpload(++counter)
        }
      }

      if (isValidFile(file)) {
        ++uploading.totalFiles

        uploading.data.push(file)

        if (uploading.totalFiles === 1) {
          proceedUpload()
        }
      }
    },
    onChange(info: UploadChangeParam) {
      if (uploading.isBeforeProcessing) {
        const isNewFiles = info.fileList.some(({ name }) => !uploadingBlobs[name])

        if (!isNewFiles) return

        setFinishedNumberOfFiles(uploadingFiles.length)
        info.fileList.forEach(file => {
          const isFileAlreadyUploaded = uploadingBlobs[file.name]
          !isFileAlreadyUploaded && dispatch(addUploadingFile(new MediaInstance({
            mimetype: file.originFileObj?.type as MimeTypes,
            originalName: (file.originFileObj?.name as Media['originalName'] | undefined) || 'unknown_file.jpg',
          }).properties))
        })
      }
      uploading.isBeforeProcessing = false
      const { status } = info.file
      status !== 'uploading' && console.info(info.file, info.fileList)
      status === 'done' && message.success(`${info.file.name} file uploaded successfully.`)
      status === 'error' && message.error(`${info.file.name} file upload failed.`)
    },
  }

  const progress = useMemo(
    () => (uploadingFiles.length
      ? Math.round((finishedNumberOfFiles / uploadingFiles.length) * 100) || false
      : false),
    [finishedNumberOfFiles, uploadingFiles.length],
  )

  useEffect(() => {
    const refreshLoading = () => {
      setFinishedNumberOfFiles(0)
      uploading.totalFiles = 0
      uploading.isBeforeProcessing = true
      uploading.data = []
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
