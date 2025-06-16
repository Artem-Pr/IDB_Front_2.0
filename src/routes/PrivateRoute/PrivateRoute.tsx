import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'


import { useIsAuthenticated } from 'src/app/common/hooks'
import { UnauthorizedPage } from 'src/app/pages/UnauthorizedPage'
import { Permissions } from 'src/constants/permissions'

import { Paths } from '../paths'
import { LocationState } from '../types'

import styles from './PrivateRoute.module.scss'

interface Props {
    element: React.JSX.Element
    permission: string
}

export const PrivateRoute = ({ element, permission }: Props) => {
  const location = useLocation()
  const isAuth = useIsAuthenticated()
  // const permissions = usePermissions(isAuth)
  const permissions: string[] = [Permissions.GLOBAL] // Mocked permissions for demonstration

  // const awaitingPermissions = permissions.length === 0
  const awaitingPermissions = false
  const unauthorized = !awaitingPermissions && !permissions.includes(permission)

  if (!isAuth) {
    return (
      <Navigate
        to={Paths.LOGIN}
        state={{ from: location } as LocationState}
        replace
      />
    )
  }

  if (unauthorized) {
    return <UnauthorizedPage />
  }

  if (awaitingPermissions) {
    return <div className={styles.blankPage} />
  }

  return element
}
