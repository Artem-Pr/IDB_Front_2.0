import React from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd'

import { useCurrentPage } from '../../common/hooks'

const { Header: HeaderLayout } = Layout
const { Title } = Typography

const Header = () => {
  const { currentPageNumber } = useCurrentPage()

  return (
    <HeaderLayout className="d-flex justify-content-between align-items-center">
      <Title>IDBase</Title>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentPageNumber]}>
        <Menu.Item key="1">
          <NavLink to="/">Main page</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/upload">Upload</NavLink>
        </Menu.Item>
      </Menu>
    </HeaderLayout>
  )
}

export default Header
