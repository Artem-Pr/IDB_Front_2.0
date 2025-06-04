import React, { useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { Menu } from 'antd'

import { PagePaths } from 'src/common/constants'

import { useAuth } from '../../contexts/AuthContext'

import { PageMenuItems } from './PageMenuItems'

const menuStyle = { width: 500 }

export const HeaderMenu = () => {
  const { pathname } = useLocation() as { pathname: PagePaths }
  const defaultKeys = useMemo(() => [pathname], [pathname])
  const { logout } = useAuth()
  const history = useHistory()

  const handleMenuClick = async (e: { key: string }) => {
    if (e.key === 'logout') {
      try {
        await logout()
        history.push(PagePaths.LOGIN)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  }

  return (
    <Menu
      style={menuStyle}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={defaultKeys}
      items={PageMenuItems}
      onClick={handleMenuClick}
    />
  )
}
