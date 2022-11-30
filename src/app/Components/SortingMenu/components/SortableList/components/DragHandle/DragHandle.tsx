import React, { useContext } from 'react'
import { Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import { SortableItemContext } from '../../utils'

import styles from './DragHandle.module.scss'

export const DragHandle = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext)

  return (
    <Button type="text" className={styles.button} {...attributes} {...listeners} ref={ref} icon={<MenuOutlined />} />
  )
}
