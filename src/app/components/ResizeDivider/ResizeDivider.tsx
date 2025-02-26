/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'

import { MoreOutlined } from '@ant-design/icons'

import styles from './ResizeDivider.module.scss'

export const RESIZE_DIVIDER_WIDTH = 10

interface Props {
  onDividerMove: (pageX: number) => void
  onMouseUp: () => void
}

export const ResizeDivider = ({ onDividerMove, onMouseUp }: Props) => {
  const dividerMouseUp = () => {
    onMouseUp()
    removeDividerListeners()
  }

  const dividerMouseMove = (event: MouseEvent) => {
    onDividerMove(event.pageX)
  }

  const removeDividerListeners = () => {
    window.removeEventListener('mousemove', dividerMouseMove)
    window.removeEventListener('mouseup', dividerMouseUp)
  }

  const handleDividerMouseDown = () => {
    window.addEventListener('mousemove', dividerMouseMove)
    window.addEventListener('mouseup', dividerMouseUp)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.divider} onMouseDown={handleDividerMouseDown}>
        <MoreOutlined className={styles.resizeIcon} style={{ width: RESIZE_DIVIDER_WIDTH }} />
      </div>
    </div>
  )
}
