import React from 'react'

import { LoginPage } from 'src/app/pages/LoginPage'
import MainPage from 'src/app/pages/MainPage'
import { SettingsPage } from 'src/app/pages/SettingsPage'
import TestDB from 'src/app/pages/TestDB'
import UploadPage from 'src/app/pages/UploadPage'
import { Permissions } from 'src/constants/permissions'

import { Paths } from './paths'
import { RouteType } from './types'

export const routes: RouteType[] = [
  {
    path: Paths.LOGIN,
    element: <LoginPage />,
  },
  {
    path: Paths.ROOT,
    // element: <Navigate to={Paths.ROOT} replace />,
    element: <MainPage />,
    permission: Permissions.GLOBAL,
  },
  {
    path: Paths.UPLOAD,
    element: <UploadPage />,
    permission: Permissions.GLOBAL,
  },
  {
    path: Paths.SETTINGS,
    element: <SettingsPage />,
    permission: Permissions.GLOBAL,
  },
  {
    path: Paths.TEST_DB,
    element: <TestDB />,
    permission: Permissions.GLOBAL,
  }
]
