import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Form,
  Button,
  Input, Row,
  Col,
  Typography,
} from 'antd'

import { useIsAuthenticated } from 'src/app/common/hooks'
import { useUppyUploader } from 'src/app/components/UppyUploader/hooks/useUppyUploader'
import {
  passwordValidationRules,
  userNameValidationRules,
} from 'src/common/formValidationRules'
import { getSessionReducerAccessToken } from 'src/redux/reducers/sessionSlice/selectors'
import { login } from 'src/redux/reducers/sessionSlice/thunks'
import { useAppDispatch } from 'src/redux/store/store'
import type { LocationState } from 'src/routes/types'

import { RegisterSection } from './components/RegisterSection'
import type { LoginFormData } from './types'

import styles from './LoginPage.module.scss'

const { Title, Paragraph } = Typography

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const isAuth = useIsAuthenticated()
  const accessToken = useSelector(getSessionReducerAccessToken)
  const uppy = useUppyUploader()

  useEffect(() => {
    uppy.uppyInstance?.destroy()
  }, [uppy])

  useEffect(() => {
    const redirectFromLoginPage = () => {
      const from = (location.state as LocationState)?.from

      if (!from) {
        navigate('/', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }

    if (isAuth) {
      uppy.reduxStore && uppy.init()
      redirectFromLoginPage()
    }
  }, [accessToken, dispatch, isAuth, location.state, navigate])

  const onFinish = ({ username, password }: LoginFormData) => {
    void dispatch(login(username, password))
  }

  return (
    <Col
      span={24}
      className={styles.loginContainer}
    >
      <Form<LoginFormData>
        className={styles.loginForm}
        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <Row
          justify="center"
          align="middle"
        >
          <Title level={2}>Log in</Title>
        </Row>

        <Row justify="center">
          <Paragraph>Use your user name and password to log in.</Paragraph>
        </Row>

        <Row justify="center">
          <Form.Item
            className={styles.loginInput}
            name="username"
            label="User Name"
            rules={userNameValidationRules}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>
        </Row>

        <Row justify="center">
          <Form.Item
            className={styles.loginInput}
            name="password"
            label="Password"
            rules={passwordValidationRules}
          >
            <Input.Password placeholder="Enter a password" />
          </Form.Item>
        </Row>

        <Row justify="center">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              Log in
            </Button>
          </Form.Item>
        </Row>
        <RegisterSection />
      </Form>
    </Col>
  )
}
