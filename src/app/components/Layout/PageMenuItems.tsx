import React from 'react'
import { NavLink } from 'react-router-dom'

import type { MenuProps } from 'antd'

import { Paths } from 'src/routes/paths'

export const PageMenuItems: MenuProps['items'] = [
  {
    key: Paths.MAIN,
    label: <NavLink to={Paths.MAIN}>Main page</NavLink>,
  },
  {
    key: Paths.UPLOAD,
    label: <NavLink to={Paths.UPLOAD}>Upload</NavLink>,
  },
  {
    key: Paths.SETTINGS,
    label: <NavLink to={Paths.SETTINGS}>Settings</NavLink>,
  },
  {
    key: Paths.TEST_DB,
    label: <NavLink to={Paths.TEST_DB}>Database tests</NavLink>,
  },
]
