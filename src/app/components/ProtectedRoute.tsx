import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

import { PagePaths } from 'src/common/constants'

import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps extends RouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) => (isAuthenticated
        ? (
          children
        )
        : (
          <Redirect
            to={{
              pathname: PagePaths.LOGIN,
              state: { from: location },
            }}
          />
        ))}
    />
  )
}
