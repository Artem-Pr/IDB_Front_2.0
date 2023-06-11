import React from 'react'

import { Card, Collapse } from 'antd'

import styles from './index.module.scss'

const { Panel } = Collapse

interface Props {
  title: string
  value?: string[]
}

const TableCollapse = ({ title, value }: Props) => {
  return (
    <Card.Grid hoverable={false} className={styles.collapseCardGrid}>
      <Collapse collapsible={value?.length ? 'header' : 'disabled'}>
        <Panel header={title} key="1">
          {value?.map(folder => (
            <p key={folder}>{folder}</p>
          ))}
        </Panel>
      </Collapse>
    </Card.Grid>
  )
}

export default TableCollapse
