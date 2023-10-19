import React from 'react'
import { Button as ButtonAntd, Tooltip } from 'antd'
import type { ButtonProps } from 'antd'
import cn from 'classnames'

import { CheckOutlined } from '@ant-design/icons'

import styles from './Button.module.scss'

export interface UIKitButton extends ButtonProps {
  className?: string
  tooltip?: string
  isSuccess?: boolean
}

export const UIKitBtn = ({ className, tooltip, isSuccess, icon, ...restProps }: UIKitButton) => (
  <Tooltip title={tooltip}>
    <ButtonAntd
      className={cn({ [styles.btnSuccess]: isSuccess }, className)}
      icon={isSuccess && icon ? <CheckOutlined /> : icon}
      {...restProps}
    />
  </Tooltip>
)
