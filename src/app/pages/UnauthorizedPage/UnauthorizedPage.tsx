import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Result } from 'antd'

import styles from './UnauthorizedPage.module.scss'

export const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <Result
      className={styles.resultContainer}
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={(
        <Button
          type="primary"
          onClick={() => navigate('/')}
        >
            Back to Home
        </Button>
      )}
    />
  )
}
