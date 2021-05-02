import React from 'react'
import { Alert } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import cn from 'classnames'

import styles from './index.module.scss'

interface Props {
  message: string
  hide: boolean
  type: 'success' | 'info' | 'warning' | 'error'
}

const CustomAlert = ({ message, hide, type }: Props) => {
  return (
    <Alert
      className={cn(styles.alert, { hide }, 'justify-content-center')}
      message={message}
      type={type}
      icon={<InfoCircleFilled />}
      showIcon
    />
  )
}

export default CustomAlert
