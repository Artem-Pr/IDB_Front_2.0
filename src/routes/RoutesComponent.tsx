import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'

import { PrivateRoute } from './PrivateRoute'
import { routes } from './routes'

export const RoutesComponent = () => (
  <>
    {routes.map((route, i) => {
      if (route.permission) {
        return (
          <Route
            key={i}
            path={route.path}
            element={(
              <Suspense fallback="Loading...">
                <PrivateRoute
                  element={route.element}
                  permission={route.permission}
                />
              </Suspense>
            )}
          />
        )
      }
      return (
        <Route
          key={i}
          path={route.path}
          element={
            <Suspense fallback="Loading...">
              {route.element}
            </Suspense>
          }
        />
      )
    })}
  </>
)
