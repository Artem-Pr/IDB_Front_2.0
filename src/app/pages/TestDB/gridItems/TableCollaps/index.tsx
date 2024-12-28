import React from 'react'

import { Card, Collapse } from 'antd'

import styles from './index.module.scss'

interface Props {
  title: string
  value?: string[]
}

const TableCollapse = ({ title, value }: Props) => (
  <Card.Grid hoverable={false} className={styles.collapseCardGrid}>
    <Collapse
      collapsible={value?.length ? 'header' : 'disabled'}
      items={[
        {
          key: '1',
          label: title,
          children: value?.map(folder => (
            <p key={folder}>{folder}</p>
          )),
        },
      ]}
    />
  </Card.Grid>
)

export default TableCollapse
