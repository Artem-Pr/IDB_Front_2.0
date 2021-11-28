import React from 'react'
import { Col, Layout, Row } from 'antd'
import { Content } from 'antd/es/layout/layout'

import styles from './index.module.scss'
import MatchingNumberOfFiles from './tests/MatchingNumberOfFiles'
import MatchingVideoFiles from './tests/MatchingVideoFiles'

const TestDB = () => {
  return (
    <Layout>
      <Content className={styles.container}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <MatchingNumberOfFiles />
          </Col>
          <Col span={12}>
            <MatchingVideoFiles />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default TestDB
