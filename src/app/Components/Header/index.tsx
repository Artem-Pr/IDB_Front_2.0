import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

const Header = () => {
  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <Title>IDBase</Title>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">
          <Link to="/">Main page</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/upload">Upload</Link>
        </Menu.Item>
      </Menu>
    </HeaderLayout>
  )
}

export default Header
