import React, {
  memo, useContext, useEffect, useState,
} from 'react'
import { useSelector } from 'react-redux'

import { CloseSquareOutlined, DownCircleOutlined } from '@ant-design/icons'
import { Dashboard } from '@uppy/react'
import { Modal } from 'antd'
import cn from 'classnames'

import { UppyInstanceContext } from 'src/common/UppyInstanceContext'
import { uploadReducerSetShowUppyUploaderModal } from 'src/redux/reducers/uploadSlice'
import { getUploadReducerShowUppyUploaderModal } from 'src/redux/reducers/uploadSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import styles from './index.module.scss'

export const UppyUploader = memo(() => {
  const dispatch = useAppDispatch()
  const uppy = useContext(UppyInstanceContext)
  const showModal = useSelector(getUploadReducerShowUppyUploaderModal)
  const [collapsed, setCollapsed] = useState(false)
  const [disableCloseButton, setDisableCloseButton] = useState(false)

  useEffect(() => {
    const handleComplete = () => {
      setDisableCloseButton(false)
    }
    const handleStart = () => {
      setDisableCloseButton(true)
    }

    if (uppy) {
      uppy.on('complete', handleComplete)
      uppy.on('upload-start', handleStart)
    }

    return () => {
      uppy?.off('complete', handleComplete)
      uppy?.off('upload-start', handleStart)
    }
  }, [dispatch, uppy])

  const handleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleClose = () => {
    const currentProgress = uppy?.getState().totalProgress
    if (currentProgress === 100) {
      dispatch(uploadReducerSetShowUppyUploaderModal(false))
    }
  }

  const handleAfterClose = () => {
    uppy?.clear()
  }

  return (
    uppy && (
      <Modal
        cancelButtonProps={{ disabled: true }}
        className={cn(styles.uppyModal, { [styles.hidden]: collapsed })}
        closable={false}
        footer={null}
        mask={false}
        maskClosable={false}
        afterClose={handleAfterClose}
        open={showModal}
      >
        <>
          <DownCircleOutlined onClick={handleCollapse} />
          <CloseSquareOutlined disabled={disableCloseButton} onClick={handleClose} />
          <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            showProgressDetails
          />
        </>
      </Modal>
    )
  )
})
