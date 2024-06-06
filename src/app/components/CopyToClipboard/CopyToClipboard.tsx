import React from 'react'

import { CopyOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { copyToClipboard } from '../../common/utils'
import { DATE_TIME_FORMAT } from '../../common/utils/date'

interface CopyToClipboardProps {
  text: number | string | null
  disabled?: boolean
}

export const CopyToClipboard = ({ text, disabled }: CopyToClipboardProps) => {
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
