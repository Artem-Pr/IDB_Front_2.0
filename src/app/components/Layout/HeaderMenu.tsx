import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Menu } from 'antd'

import { Paths } from 'src/routes/paths'

import { PageMenuItems } from './PageMenuItems'

const menuStyle: React.CSSProperties = { width: 400, marginLeft: 'auto' }

export const HeaderMenu = () => {
  const { pathname } = useLocation() as { pathname: Paths }
  const defaultKeys = useMemo(() => [pathname], [pathname])

  return (
    <Menu
      style={menuStyle}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={defaultKeys}
      items={PageMenuItems}
    />
  )
}
