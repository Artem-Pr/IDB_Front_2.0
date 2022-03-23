import React from 'react'
import { Col, Layout, Row } from 'antd'
import { Content } from 'antd/es/layout/layout'

import styles from './index.module.scss'
import MatchingNumberOfFiles from './tests/MatchingNumberOfFiles'
import MatchingVideoFiles from './tests/MatchingVideoFiles'
import RebuildPathsConfig from './tests/RebuildPathsConfig'
import CheckFilesWithSameNames from './tests/CheckFilesWithSameNames'

const TestDB = () => {
  return (
    <Layout>
      <Content className={styles.container}>
        <Row gutter={[16, 16]}>
          <Col className={styles.col} span={12}>
            <MatchingNumberOfFiles />
          </Col>
          <Col className={styles.col} span={12}>
            <MatchingVideoFiles />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col className={styles.col} span={12}>
            <RebuildPathsConfig />
          </Col>
          <Col className={styles.col} span={12}>
            <CheckFilesWithSameNames />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default TestDB
