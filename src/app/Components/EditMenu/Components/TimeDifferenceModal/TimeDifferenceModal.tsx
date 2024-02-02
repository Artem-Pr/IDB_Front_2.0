import React, { memo, useState } from 'react'

import { FieldTimeOutlined } from '@ant-design/icons'
import { Modal, Spin } from 'antd'

import { UIKitBtn } from '../../../UIKit/Button'

import { TDModalMapper } from './components'
import { useUpdateOriginalDate } from './hooks'

import styles from './TimeDifferenceModal.module.scss'

export const TimeDifferenceModal = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const {
    isOriginalDatesUpdated, setOriginalDatesObj, updateOriginalDates, isTimesDifferenceApplied,
  } = useUpdateOriginalDate()

  const showModal = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      setShowContent(true)
    }, 300)
  }

  const handleOk = () => {
    setShowContent(false)
    setTimeout(() => {
      updateOriginalDates()
      setIsModalOpen(false)
    }, 300)
  }

  const handleCancel = () => {
    setShowContent(false)
    setTimeout(() => {
      setOriginalDatesObj({})
      setIsModalOpen(false)
    }, 300)
  }

  return (
    <>
      <UIKitBtn
        tooltip="time difference"
        className="margin-left-10"
        type="primary"
        icon={<FieldTimeOutlined />}
        isSuccess={isTimesDifferenceApplied}
        onClick={showModal}
      />
      <Modal
        title="Calculate time difference"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !isOriginalDatesUpdated }}
        wrapClassName={styles.modal}
      >
        {showContent
          ? (
            <TDModalMapper setOriginalDatesObj={setOriginalDatesObj} />
          )
          : (
            <Spin className={styles.loader} spinning />
          )}
      </Modal>
    </>
  )
})
