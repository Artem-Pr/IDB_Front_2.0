import React from 'react'
import { Layout, Menu, Typography } from 'antd'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

const Header = () => {
  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <Title>IDBase</Title>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">Main page</Menu.Item>
        <Menu.Item key="2">Upload</Menu.Item>
      </Menu>
    </HeaderLayout>
  )
}

export default Header
