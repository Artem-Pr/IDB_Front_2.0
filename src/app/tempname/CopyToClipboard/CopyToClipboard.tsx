import React from 'react'

import { CopyOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { copyToClipboard } from '../../common/utils'
import { dateTimeFormat } from '../../common/utils/date'

interface CopyToClipboardProps {
  text: number | string
  disabled?: boolean
}

export const CopyToClipboard = ({ text, disabled }: CopyToClipboardProps) => {
  const copy = () => {
    typeof text === 'number'
      ? copyToClipboard(dayjs(text)
        .format(dateTimeFormat))
      : copyToClipboard(text)
  }

  return (
    <Tooltip title="Copy original date">
      <Button icon={<CopyOutlined />} onClick={copy} disabled={disabled} />
    </Tooltip>
  )
}
