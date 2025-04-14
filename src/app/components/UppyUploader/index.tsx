import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LoadingOutlined } from '@ant-design/icons'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import { Result } from 'antd'

import { MimeTypes } from 'src/common/constants'
import { getFolderReducerFolderInfoCurrentFolder } from 'src/redux/reducers/foldersSlice/selectors'
import { uploadReducerSetUploadingStatus } from 'src/redux/reducers/uploadSlice'
import { getUploadReducerFilesArr, getUploadReducerUploadStatus } from 'src/redux/reducers/uploadSlice/selectors'

import styles from './index.module.scss'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'

export const UppyUploader = () => {
  const dispatch = useDispatch()
  const currentFolderPath = useSelector(getFolderReducerFolderInfoCurrentFolder)
  const uploadingStatus = useSelector(getUploadReducerUploadStatus)
  const filesArr = useSelector(getUploadReducerFilesArr)
  const [uppy, setUppy] = useState<Uppy | null>(null)

  // Initialize Uppy instance
  useEffect(() => {
    const uppyInstance = new Uppy({
      id: 'uppy-large-files',
      autoProceed: false,
      allowMultipleUploadBatches: true,
      debug: process.env.NODE_ENV === 'development',
      restrictions: {
        maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
        allowedFileTypes: ['video/*', 'image/*', MimeTypes.heic],
      },
    })

    // Configure XHR Upload for chunked uploads
    uppyInstance.use(XHRUpload, {
      endpoint: '/api/upload/chunk',
      formData: true,
      fieldName: 'chunk',
      headers: {
        path: currentFolderPath,
        'Content-Type': 'application/json',
      },
      // Enable chunking
      limit: 4, // Limit concurrent uploads
      timeout: 60000, // 60 seconds
      // @ts-ignore
      chunkSize: 5 * 1024 * 1024, // 5MB chunks
    })

    // Handle events
    uppyInstance
      .on('file-added', file => {
        console.info('File added:', file)
        // Add file to Redux state when added to Uppy
        // const mediaInstance = new MediaInstance({
        //   mimetype: file.type as MimeTypes,
        //   originalName: file.name as string,
        // })

        // Add blob info to Redux
        // dispatch(uploadReducerSetBlob({
        //   name: file.name,
        //   originalPath: URL.createObjectURL(file.data),
        // }))
      })
      .on('upload', () => {
        dispatch(uploadReducerSetUploadingStatus('loading'))
      })
      .on('upload-success', (file, response) => {
        // Handle successful upload
        console.info('Upload success:', file, response)
      })
      .on('complete', result => {
        if (result.successful && result.successful.length > 0) {
          dispatch(uploadReducerSetUploadingStatus('success'))

          console.info('complete', result)
          // Update files array with newly uploaded files
          // const newFiles = result.successful.map(file => new MediaInstance({
          //   mimetype: file.type as MimeTypes,
          //   originalName: file.name,
          // }).properties)

          // dispatch(uploadReducerSetFilesArr([...filesArr, ...newFiles]))
        } else if (result.failed && result.failed.length > 0) {
          dispatch(uploadReducerSetUploadingStatus('error'))
        }
      })
      .on('error', error => {
        console.error('Uppy error:', error)
        dispatch(uploadReducerSetUploadingStatus('error'))
      })

    setUppy(uppyInstance)

    // Cleanup
    return () => {
      (uppyInstance as any).close()
    }
  }, [currentFolderPath, dispatch, filesArr])

  if (uploadingStatus === 'loading') {
    return <Result icon={<LoadingOutlined />} title="Uploading..." />
  }

  if (uploadingStatus === 'success') {
    return null // Success message is shown in the parent component
  }

  return (
    <div className={styles.uppyContainer}>
      {uppy && (
        <Dashboard
          uppy={uppy}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails
          height={300}
          width="100%"
          note="Support for large video files with resumable uploads"
        />
      )}
    </div>
  )
}
