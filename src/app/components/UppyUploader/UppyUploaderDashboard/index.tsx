import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { CloseSquareOutlined, DownCircleOutlined } from '@ant-design/icons'
import { Dashboard } from '@uppy/react'
import { Modal } from 'antd'
import cn from 'classnames'

import { uploadReducerSetShowUppyUploaderModal } from 'src/redux/reducers/uploadSlice'
import { getUploadReducerShowUppyUploaderModal } from 'src/redux/reducers/uploadSlice/selectors'
import { useAppDispatch } from 'src/redux/store/store'

import { useUppyUploader } from '../hooks/useUppyUploader'

import styles from './index.module.scss'

export const UppyUploader = memo(() => {
  const dispatch = useAppDispatch()
  const { uppyInstance } = useUppyUploader()
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

    if (uppyInstance) {
      uppyInstance.on('complete', handleComplete)
      uppyInstance.on('upload-start', handleStart)
    }

    return () => {
      uppyInstance?.off('complete', handleComplete)
      uppyInstance?.off('upload-start', handleStart)
    }
  }, [dispatch, uppyInstance])

  const handleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleClose = () => {
    const currentProgress = uppyInstance?.getState().totalProgress
    if (currentProgress === 100) {
      dispatch(uploadReducerSetShowUppyUploaderModal(false))
    }
  }

  const handleAfterClose = () => {
    uppyInstance?.clear()
  }

  return (
    uppyInstance && (
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
            uppy={uppyInstance}
            proudlyDisplayPoweredByUppy={false}
            showProgressDetails
          />
        </>
      </Modal>
    )
  )
})
