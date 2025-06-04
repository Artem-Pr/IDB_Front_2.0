import React from 'react'
import { NavLink } from 'react-router-dom'

import { LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { PagePaths } from 'src/common/constants'

export const PageMenuItems: MenuProps['items'] = [
  {
    key: PagePaths.MAIN,
    label: <NavLink to={PagePaths.MAIN}>Main page</NavLink>,
  },
  {
    key: PagePaths.UPLOAD,
    label: <NavLink to={PagePaths.UPLOAD}>Upload</NavLink>,
  },
  {
    key: PagePaths.SETTINGS,
    label: <NavLink to={PagePaths.SETTINGS}>Settings</NavLink>,
  },
  {
    key: PagePaths.TEST_DB,
    label: <NavLink to={PagePaths.TEST_DB}>Database tests</NavLink>,
  },
  {
    key: 'logout',
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LogoutOutlined />
        Logout
      </span>
    ),
  },
]
