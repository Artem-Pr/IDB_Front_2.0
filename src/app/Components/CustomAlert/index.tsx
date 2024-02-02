import React from 'react'

import { InfoCircleFilled } from '@ant-design/icons'
import { Alert } from 'antd'
import cn from 'classnames'

import styles from './index.module.scss'

interface Props {
  message: string
  hide: boolean
  type: 'success' | 'info' | 'warning' | 'error'
}

const CustomAlert = ({ message, hide, type }: Props) => (
  <Alert
    className={cn(styles.alert, { hide }, 'justify-content-center')}
    message={message}
    type={type}
    icon={<InfoCircleFilled />}
    showIcon
  />
)

export default CustomAlert
