import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import {
  Form, Input, Button, Card, message,
} from 'antd'

import { PagePaths } from 'src/common/constants'
import { sessionReducerSetCurrentPage } from 'src/redux/reducers/sessionSlice'
import { useAppDispatch } from 'src/redux/store/store'

import { useAuth } from '../contexts/AuthContext'

interface LoginFormValues {
  username: string
  password: string
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const from = (location.state as any)?.from?.pathname || '/'

  useEffect(() => {
    dispatch(sessionReducerSetCurrentPage(PagePaths.LOGIN))

    return () => {
      dispatch(sessionReducerSetCurrentPage(null))
    }
  }, [dispatch])

  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(values)
      message.success('Login successful')
      history.replace(from)
    } catch (error) {
      message.error('Login failed. Please check your credentials.')
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
      background: '#f0f2f5',
    }}
    >
      <Card style={{ width: 400, padding: '24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
