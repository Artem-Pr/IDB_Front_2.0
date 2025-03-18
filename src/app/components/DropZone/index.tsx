import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  message, Progress, Result, Upload, UploadProps,
} from 'antd'
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import cn from 'classnames'
import { compose } from 'ramda'

import type { Media } from 'src/api/models/media'
import { MediaInstance } from 'src/api/models/media'
import { errorMessage } from 'src/app/common/notifications'
import { wait, isMimeType } from 'src/app/common/utils'
import { MainMenuKeys, MimeTypes } from 'src/common/constants'
import { getFolderReducerFolderInfoCurrentFolder } from 'src/redux/reducers/foldersSlice/selectors'
import { sessionReducerSetIsLoading } from 'src/redux/reducers/sessionSlice'
import { uploadReducerIncreaseCountOfPreviewLoading, uploadReducerSetBlob, uploadReducerSetUploadingStatus } from 'src/redux/reducers/uploadSlice'
import {
  getUploadReducerBlobs, getUploadReducerFilesArr, getUploadReducerPreviewLoadingCount,
} from 'src/redux/reducers/uploadSlice/selectors'
import { addUploadingFile, fetchPhotosPreview } from 'src/redux/reducers/uploadSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'
import type { LoadingStatus } from 'src/redux/types'

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
  loadingStatus: LoadingStatus
}

const DropZone = ({ openMenus, loadingStatus }: Props) => {
  const currentFolderPath = useSelector(getFolderReducerFolderInfoCurrentFolder)
  const previewLoadingCount = useSelector(getUploadReducerPreviewLoadingCount)
  const uploadingBlobs = useSelector(getUploadReducerBlobs)
  const uploadingFiles = useSelector(getUploadReducerFilesArr)
  const [finishedNumberOfFiles, setFinishedNumberOfFiles] = useState<number>(0)
  const dispatch = useAppDispatch()
  const isEditOne = useMemo(() => openMenus.includes(MainMenuKeys.EDIT), [openMenus])
  const isEditMany = useMemo(() => openMenus.includes(MainMenuKeys.EDIT_BULK), [openMenus])

  const handleError = (notificationMessage: string, file: string | RcFile | Blob | UploadFile) => {
    const uploadingError = new Error(`${isFile(file) ? file.name : '?'} ${notificationMessage}`)
    errorMessage(uploadingError, 'File is not uploaded')
    uploading.isProcessing = false
  }

  const isValidFile = (
    fileFormQueue: string | Blob | RcFile | UploadFile,
    showError: boolean = true,
  ): fileFormQueue is ValidRcFile | UploadFile => {
    const fileAlreadyExist = isFile(fileFormQueue) && isFileNameAlreadyExist(fileFormQueue, uploadingBlobs)
    const isMimeTypeExist = isFile(fileFormQueue) && isMimeType(fileFormQueue.type)

    showError && fileAlreadyExist && handleError('is already exist', fileFormQueue)
    showError && !isMimeTypeExist && handleError('file type not supported', fileFormQueue)

    return !fileAlreadyExist && isMimeTypeExist
  }

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
      dispatch(sessionReducerSetIsLoading(true))
      const uploadFile = async (fileFormQueue: RcFile) => {
        const dispatchNewFile = async () => {
          uploading.isProcessing = true
          dispatch(uploadReducerIncreaseCountOfPreviewLoading())
          isFile(fileFormQueue) && compose(dispatch, uploadReducerSetBlob, getDispatchObjFromBlob)(fileFormQueue)
          dispatch<any>(fetchPhotosPreview(fileFormQueue))
            .then(() => {
              uploading.isProcessing = false
              setFinishedNumberOfFiles(prevState => prevState + 1)
            })
          dispatch(uploadReducerSetUploadingStatus('empty'))
        }
        dispatchNewFile()
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
          if (!isValidFile(file, false)) {
            uploading.isBeforeProcessing = true
            return
          }

          const isFileAlreadyUploaded = uploadingBlobs[file.name]
          !isFileAlreadyUploaded && dispatch(addUploadingFile(new MediaInstance({
            mimetype: file.originFileObj?.type as MimeTypes,
            originalName: (file.originFileObj?.name as Media['originalName'] | undefined) || 'unknown_file.jpg',
          }).properties))

          uploading.isBeforeProcessing = false
        })
      } else {
        uploading.isBeforeProcessing = false
      }
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
      {loadingStatus === 'loading'
        ? <Result icon={<LoadingOutlined />} title="Loading..." />
        : (
          <>
            <p className="ant-upload-drag-icon">
              {finishedNumberOfFiles || previewLoadingCount ? <LoadingOutlined /> : <InboxOutlined />}
            </p>
            {progress && <Progress percent={progress} style={{ maxWidth: 200 }} />}
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </>
        )}
    </Dragger>
  )
}

export default DropZone
