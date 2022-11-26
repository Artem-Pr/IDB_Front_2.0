import React from 'react'
import { NavLink } from 'react-router-dom'
import type { MenuProps } from 'antd'

import { PagePaths } from '../../../redux/types'

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
]
