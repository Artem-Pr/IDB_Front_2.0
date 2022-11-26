import React from 'react'

import { Button, Card } from 'antd'

import styles from './index.module.scss'

interface Props {
  title: string
  value: string | number
  action?: (type: string) => void
}

const TableRow = ({ title, value, action }: Props) => {
  return (
    <div className="d-flex">
      <Card.Grid hoverable={false} className={styles.contentCardGrid}>
        {title}
        {action && (
          <Button type="primary" size="small" onClick={() => action(title)}>
            Show
          </Button>
        )}
      </Card.Grid>
      <Card.Grid hoverable={false} className={styles.resultCardGrid}>
        {value}
      </Card.Grid>
    </div>
  )
}

export default TableRow
