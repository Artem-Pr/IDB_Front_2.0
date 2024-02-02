import React from 'react'

import { MoreOutlined } from '@ant-design/icons'

import styles from './ResizeDivider.module.scss'

interface Props {
  onDividerMove: (moveX: number) => void
  onMouseUp: () => void
}

export const ResizeDivider = ({ onDividerMove, onMouseUp }: Props) => {
  const dividerMouseUp = () => {
    onMouseUp()
    removeDividerListeners()
  }

  const dividerMouseMove = ({ movementX }: MouseEvent) => {
    onDividerMove(movementX)
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={styles.divider} onMouseDown={handleDividerMouseDown}>
      <MoreOutlined className={styles.resizeIcon} />
    </div>
  )
}
