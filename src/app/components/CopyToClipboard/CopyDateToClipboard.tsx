import React from 'react'

import { CopyOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { DATE_TIME_FORMAT } from 'src/constants/dateConstants'

import { copyToClipboard } from '../../common/utils'

interface CopyToClipboardProps {
  text: number | string | null
  disabled?: boolean
}

export const CopyDateToClipboard = ({ text, disabled }: CopyToClipboardProps) => {
  const copy = () => {
    if (text === null) return

    typeof text === 'number'
      ? copyToClipboard(dayjs(text)
        .format(DATE_TIME_FORMAT))
      : copyToClipboard(text)
  }

  return (
    <Tooltip title="Copy original date">
      <Button icon={<CopyOutlined />} onClick={copy} disabled={disabled} />
    </Tooltip>
  )
}
