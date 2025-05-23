import React, { memo } from 'react'

import { Col, Layout, Row } from 'antd'
import { Content } from 'antd/es/layout/layout'
// import CheckFilesWithSameNames from './tests/CheckFilesWithSameNames'
// import { FilesTest } from './tests/FilesTest'
import cn from 'classnames'

import MatchingNumberOfFiles from './tests/MatchingNumberOfFiles'
// import MatchingVideoFiles from './tests/MatchingVideoFiles'

import styles from './index.module.scss'

const TestDB = memo(() => (
  <Layout>
    <Content className={styles.container}>
      <Row gutter={[16, 16]}>
        <Col className={cn(styles.col, styles.maxWidth)} span={24}>
          <MatchingNumberOfFiles />
        </Col>
        {/* <Col className={styles.col} span={12}>
          <MatchingVideoFiles />
        </Col> */}
      </Row>
      {/* <Row gutter={[16, 16]}>
        <Col className={styles.col} span={12}>
          <FilesTest />
        </Col>
        <Col className={styles.col} span={12}>
          <CheckFilesWithSameNames />
        </Col>
      </Row> */}
    </Content>
  </Layout>
))

export default TestDB
