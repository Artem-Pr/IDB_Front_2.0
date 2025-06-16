import React from 'react'
import { Link } from 'react-router-dom'

import {
  Row,
  Typography,
  Divider,
  Button,
} from 'antd'

import { Paths } from 'src/routes/paths'

import styles from '../../LoginPage.module.scss'

const { Title } = Typography

export const RegisterSection = () => (
  <>
    <Divider />

    <Row
      justify="center"
      align="middle"
    >
      <Title level={5}>New here? Create an account:</Title>
    </Row>

    <Row
      className={styles.registerBtnContainer}
      justify="center"
    >
      <Button>
        <Link to={Paths.MAIN}>
        Register
        </Link>
      </Button>
    </Row>
  </>
)

