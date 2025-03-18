import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { Menu } from 'antd'

import { PagePaths } from 'src/common/constants'

import { PageMenuItems } from './PageMenuItems'

const menuStyle = { width: 400 }

export const HeaderMenu = () => {
  const { pathname } = useLocation() as { pathname: PagePaths }
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
